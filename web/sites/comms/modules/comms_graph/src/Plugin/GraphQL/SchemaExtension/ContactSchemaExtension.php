<?php

namespace Drupal\comms_graph\Plugin\GraphQL\SchemaExtension;

use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql\GraphQL\ResolverRegistryInterface;
use Drupal\graphql\GraphQL\Response\ResponseInterface;
use Drupal\graphql\Plugin\GraphQL\SchemaExtension\SdlSchemaExtensionPluginBase;

use Drupal\comms_graph\GraphQL\Response\EntityResponse;
use Drupal\comms_graph\Wrappers\QueryConnection;

/**
 * @SchemaExtension(
 *   id = "contact",
 *   name = "Contact extension",
 *   description = "Extension to add contacts",
 *   schema = "comms"
 * )
 */
class ContactSchemaExtension extends SdlSchemaExtensionPluginBase {

  /**
   * {@inheritdoc}
   */
  public function registerResolvers(ResolverRegistryInterface $registry): void {
    $builder = new ResolverBuilder();

    $registry->addFieldResolver('Contact', 'id',
      $builder->produce('entity_id')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('Contact', 'uuid',
      $builder->produce('entity_uuid')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('Contact', 'name',
      $builder->compose(
        $builder->produce('entity_label')
          ->map('entity', $builder->fromParent())
      )
    );

    $registry->addFieldResolver('Contact', 'type',
      $builder->compose(
        $builder->fromPath('entity:node', 'field_type'),
        $builder->map(
          $builder->callback(function ($parent) {
            $definition = \Drupal::service('entity_type.manager')->getDefinition('node');
            $field_definitions = \Drupal::service('entity_field.manager')->getFieldDefinitions($definition->id(), 'contact_info');
            return $field_definitions['field_type']->getFieldStorageDefinition()->getSettings()['allowed_values'][$parent['value']];
          })
        )
      )
    );

    $registry->addFieldResolver('Contact', 'phoneNumbers',
      $builder->compose(
        $builder->fromPath('entity:node', 'field_phone_number'),
        $builder->map(
          $builder->callback(function ($parent) {
            return $parent['value'];
          })
        )
      )
    );

    $registry->addFieldResolver('Contact', 'emailAddresses',
      $builder->compose(
        $builder->fromPath('entity:node', 'field_email_address'),
        $builder->map(
          $builder->callback(function ($parent) {
            return $parent['value'];
          })
        )
      )
    );

    $registry->addFieldResolver('ContactResponse', 'contact',
      $builder->callback(function (EntityResponse $response) {
        return $response->entity();
      })
    );

    $registry->addFieldResolver('ContactResponse', 'errors',
      $builder->callback(function (EntityResponse $response) {
        return $response->getViolations();
      })
    );

    $this->addQueryFields($registry, $builder);
    $this->addMutationFields($registry, $builder);
    $this->addConnectionFields('ContactConnection', $registry, $builder);
  }

  /**
   * @param \Drupal\graphql\GraphQL\ResolverRegistryInterface $registry
   * @param \Drupal\graphql\GraphQL\ResolverBuilder $builder
   */
  protected function addQueryFields(ResolverRegistryInterface $registry, ResolverBuilder $builder): void {
    $registry->addFieldResolver('Query', 'contact',
      $builder->produce('entity_load')
        ->map('type', $builder->fromValue('node'))
        ->map('bundles', $builder->fromValue(['contact_info']))
        ->map('id', $builder->fromArgument('id'))
    );

    $registry->addFieldResolver('Query', 'contacts',
      $builder->produce('query_contacts')
        ->map('type', $builder->fromArgument('type'))
        ->map('offset', $builder->fromArgument('offset'))
        ->map('limit', $builder->fromArgument('limit'))
    );
  }


  /**
   * @param \Drupal\graphql\GraphQL\ResolverRegistryInterface $registry
   * @param \Drupal\graphql\GraphQL\ResolverBuilder $builder
   */
  protected function addMutationFields(ResolverRegistryInterface $registry, ResolverBuilder $builder): void {
    $registry->addFieldResolver('Mutation', 'saveContact',
      $builder->produce('save_contact')
        ->map('data', $builder->fromArgument('data'))
    );
  }

  /**
   * @param string $type
   * @param \Drupal\graphql\GraphQL\ResolverRegistryInterface $registry
   * @param \Drupal\graphql\GraphQL\ResolverBuilder $builder
   */
  protected function addConnectionFields($type, ResolverRegistryInterface $registry, ResolverBuilder $builder): void {
    $registry->addFieldResolver($type, 'total',
      $builder->callback(function (QueryConnection $connection) {
        return $connection->total();
      })
    );

    $registry->addFieldResolver($type, 'items',
      $builder->callback(function (QueryConnection $connection) {
        return $connection->items();
      })
    );
  }
}
