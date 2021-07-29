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
 *   id = "plan",
 *   name = "Plan extension",
 *   description = "Extension to add plans",
 *   schema = "comms"
 * )
 */
class PlanSchemaExtension extends SdlSchemaExtensionPluginBase {

  /**
   * {@inheritdoc}
   */
  public function registerResolvers(ResolverRegistryInterface $registry): void {
    $builder = new ResolverBuilder();

    $registry->addFieldResolver('Plan', 'id',
      $builder->produce('entity_id')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('Plan', 'uuid',
      $builder->produce('entity_uuid')
        ->map('entity', $builder->fromParent())
    );

    $registry->addFieldResolver('Plan', 'name',
      $builder->compose(
        $builder->produce('entity_label')
          ->map('entity', $builder->fromParent())
      )
    );

    $registry->addFieldResolver('Plan', 'description',
      $builder->fromPath('entity:node', 'field_description.value'),
    );

    $registry->addFieldResolver('Plan', 'legalMandate',
      $builder->fromPath('entity:node', 'field_legal_mandate.value'),
    );

    $registry->addFieldResolver('Plan', 'legalRequirements',
      $builder->compose(
        $builder->fromPath('entity:node', 'field_legal_requirement'),
        $builder->map(
          $builder->callback(function ($parent) {
            return $parent['value'];
          })
        )
      )
    );

    $registry->addFieldResolver('Plan', 'staff',
      $builder->produce('entity_reference')
        ->map('entity', $builder->fromParent())
        ->map('field', $builder->fromValue('field_staff'))
    );

    $registry->addFieldResolver('Plan', 'consultants',
      $builder->produce('entity_reference')
        ->map('entity', $builder->fromParent())
        ->map('field', $builder->fromValue('field_consultant'))
    );

    $registry->addFieldResolver('Plan', 'partners',
      $builder->produce('entity_reference')
        ->map('entity', $builder->fromParent())
        ->map('field', $builder->fromValue('field_partner'))
    );

    $registry->addFieldResolver('Plan', 'region',
      $builder->compose(
        $builder->produce('entity_reference')
          ->map('entity', $builder->fromParent())
          ->map('field', $builder->fromValue('field_partner')),
        $builder->produce('entity_label')
          ->map('entity', $builder->fromParent())
      )
    );

    $registry->addFieldResolver('Plan', 'questions',
      $builder->compose(
        $builder->fromPath('entity:node', 'field_question'),
        $builder->map(
          $builder->callback(function ($parent) {
            return $parent['value'];
          })
        )
      )
    );

    $registry->addFieldResolver('Plan', 'impactLevel',
      $builder->produce('entity_reference')
        ->map('entity', $builder->fromParent())
        ->map('field', $builder->fromValue('field_impact_level'))
    );

    $registry->addFieldResolver('Plan', 'interestLevel',
      $builder->produce('entity_reference')
        ->map('entity', $builder->fromParent())
        ->map('field', $builder->fromValue('field_interest_level'))
    );

    $registry->addFieldResolver('Plan', 'type',
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

    $registry->addFieldResolver('Plan', 'phoneNumbers',
      $builder->compose(
        $builder->fromPath('entity:node', 'field_phone_number'),
        $builder->map(
          $builder->callback(function ($parent) {
            return $parent['value'];
          })
        )
      )
    );

    $registry->addFieldResolver('Plan', 'emailAddresses',
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
    $registry->addFieldResolver('Query', 'plan',
      $builder->produce('entity_load')
        ->map('type', $builder->fromValue('node'))
        ->map('bundles', $builder->fromValue(['public_involvement_plan']))
        ->map('id', $builder->fromArgument('id'))
    );

    $registry->addFieldResolver('Query', 'plans',
      $builder->produce('query_plans')
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
