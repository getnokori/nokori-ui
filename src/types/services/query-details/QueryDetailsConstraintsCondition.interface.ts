export type QueryDetailsConstraintsOperator =
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal_to'
  | 'less_than_or_equal_to'
  | 'equal_to'
  | 'not_equal_to'
  | 'string_contains'
  | 'string_does_not_contain'
  | 'is_set'

export interface QueryDetailsConstraintsField {
  name: 'value'
  disabled: boolean
}

export interface QueryDetailsConstraintsCondition {
  operator: QueryDetailsConstraintsOperator
  label: string
  fields?: QueryDetailsConstraintsField[]
}
