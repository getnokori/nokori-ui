import type { QueryDetailsConstraintsCondition } from '@/types/services/query-details/QueryDetailsConstraintsCondition.interface'

const QueryDetailsConstraints: QueryDetailsConstraintsCondition[] = [
  {
    operator: 'greater_than',
    label: 'Greater than (>)'
  },
  {
    operator: 'less_than',
    label: 'Less than (<)'
  },
  {
    operator: 'greater_than_or_equal_to',
    label: 'Greater than or equal to (>=)'
  },
  {
    operator: 'less_than_or_equal_to',
    label: 'Less than or equal to (<=)'
  },
  {
    operator: 'equal_to',
    label: 'Equal to (=)'
  },
  {
    operator: 'not_equal_to',
    label: 'Not equal to (!=)'
  },
  {
    operator: 'string_contains',
    label: 'String contains'
  },
  {
    operator: 'string_does_not_contain',
    label: 'String does not contain'
  },
  {
    operator: 'is_set',
    label: 'Is set',
    fields: [
      {
        name: 'value',
        disabled: true
      }
    ]
  }
]

export default QueryDetailsConstraints
