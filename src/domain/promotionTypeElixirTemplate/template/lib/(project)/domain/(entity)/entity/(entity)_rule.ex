defmodule {ProjectName}.Domain.{EntityName}.Entity.{EntityName}Rule do
  import {ProjectName}.Builder
  alias {ProjectName}.Domain.Shared.BasePromotionRule.Base.BPromotionRule

  build(
    %{
      base: BPromotionRule,
      attributes: %{
        # (NEW_STRUCT_FIELD_MARKER)
      },
      functions: []
    }
  )

  alias {ProjectName}.Domain.{
    {EntityName}.Factory.{EntityName}RuleValidatorFactory
  }

  def new(id, description, (NEW_CREATE_FUNCTION_ARGS_MARKER), apply_to, products_id, categories_id, remaining_quantity, quantity_used, active, min_price_value, start_date, end_date, inserted_at, updated_at) do
    base_data = %__MODULE__{}.new.(%__MODULE__{}, id, description, apply_to, products_id, categories_id, remaining_quantity, quantity_used, active, min_price_value, start_date, end_date, inserted_at, updated_at)

    {entity_name}_rule = %__MODULE__{
      # (NEW_MODULE_FIELD_MARKER)
    }
    |> validate()

    %__MODULE__{}.response.(base_data, {entity_name}_rule)
  end

  defp validate(struct), do: {EntityName}RuleValidatorFactory.create().validate(struct)
end
