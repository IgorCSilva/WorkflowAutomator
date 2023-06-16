defmodule {ProjectName}.Domain.{EntityName}.Entity.{EntityName}Promotion do
  import {ProjectName}.Builder
  alias {ProjectName}.Domain.Shared.BasePromotion.Base.BPromotion

  build(
    %{
      base: BPromotion,
      attributes: %{
        type: :{entity_name}
      },
      functions: [
        specific_validation: &__MODULE__.specific_validation/2
      ]
    }
  )

  alias {ProjectName}.Domain.{EntityName}.Entity.{EntityName}Rule

  def new(id, active, inserted_at, updated_at) do
    base_data = %__MODULE__{}.new.(%__MODULE__{}, id, active, inserted_at, updated_at)

    {entity_name}_promotion = %__MODULE__{}
    # |> validate()

    %__MODULE__{}.response.(base_data, {entity_name}_promotion)
  end

  # TODO: Implement this function.
  def specific_validation(data, %{EntityName}Rule{} = rule), do:
end
