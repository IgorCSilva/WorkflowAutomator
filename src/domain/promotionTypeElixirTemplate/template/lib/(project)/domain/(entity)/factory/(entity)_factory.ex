defmodule {ProjectName}.Domain.{EntityName}.Factory.{EntityName}Factory do

  alias {ProjectName}.Domain.{
    {EntityName}.Entity.{EntityName}Promotion,
    {EntityName}.Entity.{EntityName}Rule
  }
  alias {ProjectName}.Domain.Promotion.Factory.IPromotionFactory

  @behaviour IPromotionFactory

  @impl IPromotionFactory
  @spec build_promotion(map()) :: {EntityName}Promotion.t() | {:error, map()}
  def build_promotion(params), do: {EntityName}Promotion.new(params[:id], params[:active], params[:inserted_at], params[:updated_at])

  @impl IPromotionFactory
  @spec build_rules(list()) :: list({EntityName}Rule.t()) | {:error, map()}
  def build_rules([]), do: []
  def build_rules(rules) when is_list(rules) do
    entities_rules = Enum.map(rules, fn rule ->
      {EntityName}Rule.new(
        rule.id,
        rule[:description],
        (NEW_RULE_ENTITY_FACTORY_FIELD_MARKER),
        rule.apply_to,
        rule.products_id,
        rule.categories_id,
        rule.remaining_quantity,
        rule[:quantity_used],
        rule.active,
        rule.min_price_value,
        rule.start_date,
        rule.end_date,
        rule.inserted_at,
        rule.updated_at
      )
    end)

    Enum.filter(entities_rules, fn rule ->
      not is_tuple(rule)
    end)
    |> case do
      [] ->
        rules_errors = Enum.map(entities_rules, fn {:error, errors} -> errors end)
        {:error, %{rules: rules_errors}}

      valid_rules -> valid_rules
    end
  end
  def build_rules(_), do: {:error, %{rules: "Rules data with invalid format."}}
end
