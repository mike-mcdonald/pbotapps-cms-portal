<?php

namespace Drupal\comms_graph\Plugin\GraphQL\SchemaExtension;

use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql\GraphQL\ResolverRegistryInterface;
use Drupal\graphql\GraphQL\Response\ResponseInterface;
use Drupal\graphql\Plugin\GraphQL\SchemaExtension\SdlSchemaExtensionPluginBase;

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

    $registry->addFieldResolver('Query', 'contact',
      $builder->produce('entity_load')
        ->map('type', $builder->fromValue('node'))
        ->map('bundles', $builder->fromValue(['contact_info']))
        ->map('id', $builder->fromArgument('id'))
    );

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
            $entityTypeManager->getDefinition('entity:node');
            return $parent['value'];
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
  }
}
