<?php

namespace Drupal\comms_graph\Plugin\GraphQL\Schema;

use Drupal\Core\Entity\EntityInterface;
use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql\GraphQL\ResolverRegistry;
use Drupal\graphql\Plugin\GraphQL\Schema\SdlSchemaPluginBase;
use Drupal\comms_graph\Wrappers\QueryConnection;

/**
 * @Schema(
 *   id = "comms",
 *   name = "Comms schema",
 *   extensions = "composable",
 * )
 */
class CommsSchema extends SdlSchemaPluginBase {

  /**
   * {@inheritdoc}
   */
  public function getResolverRegistry() {
    $builder = new ResolverBuilder();
    $registry = new ResolverRegistry();

    $this->addQueryFields($registry, $builder);
    $this->addArticleFields($registry, $builder);

    return $registry;
  }

  /**
   * @param \Drupal\graphql\GraphQL\ResolverRegistry $registry
   * @param \Drupal\graphql\GraphQL\ResolverBuilder $builder
   */
  protected function addArticleFields(ResolverRegistry $registry, ResolverBuilder $builder): void {
    $registry->addFieldResolver('Forum', 'id',
      $builder->produce('entity_id')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('Forum', 'uuid',
      $builder->produce('entity_uuid')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('Forum', 'name',
      $builder->produce('entity_label')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('Forum', 'parent',
      $builder->compose(
        $builder->produce('entity_reference')
          ->map('entity', $builder->fromParent())
          ->map('field', $builder->fromValue('parent')),
        $builder->callback(function ($value) {
          return reset($value);
        })
      )
    );

    $registry->addFieldResolver('Forum', 'topics',
      $builder->compose(
        $builder->callback(function (EntityInterface $entity) {
          $storage = \Drupal::entityTypeManager()->getStorage('node');
          $entityType = $storage->getEntityType();

          $nodes = $storage->loadByProperties([
            $entityType->getKey('bundle') => 'forum',
            'taxonomy_forums' => $entity->id()
          ]);

          $ids = array_map(function ($node) { return $node->id(); }, $nodes);

          return $ids;
        }),
        $builder->map(
          $builder->produce('entity_load')
            ->map('type', $builder->fromValue('node'))
            ->map('bundles', $builder->fromValue(['forum']))
            ->map('id', $builder->fromParent())
        )
      )
    );

    $registry->addFieldResolver('ForumTopic', 'id',
      $builder->produce('entity_id')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('ForumTopic', 'uuid',
      $builder->produce('entity_uuid')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('ForumTopic', 'subject',
      $builder->produce('entity_label')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('ForumTopic', 'body',
      $builder->compose(
        $builder->fromPath('entity:node', 'body'),
        $builder->map(function ($parent) {
          return $parent['value'];
        })
      )

    );
  }

  /**
   * @param \Drupal\graphql\GraphQL\ResolverRegistry $registry
   * @param \Drupal\graphql\GraphQL\ResolverBuilder $builder
   */
  protected function addQueryFields(ResolverRegistry $registry, ResolverBuilder $builder): void {
    $registry->addFieldResolver('Query', 'forum',
      $builder->produce('entity_load')
        ->map('type', $builder->fromValue('taxonomy_term'))
        ->map('bundles', $builder->fromValue(['forums']))
        ->map('id', $builder->fromArgument('id'))
    );

    $registry->addFieldResolver('Query', 'forums',
      $builder->produce('taxonomy_load_tree')
        ->map('vid', $builder->fromValue('forums'))
        ->map('parent', $builder->fromValue(0))
    );
  }
}
