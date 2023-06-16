defmodule {ProjectName}.Domain.{EntityName}.Validator.{EntityName}PromotionEctoValidator do

  use Ecto.Schema
  import Ecto.Changeset
  import {ProjectName}.Util.Errors

  @primary_key false
  embedded_schema do
    field :id, Ecto.UUID
    field :active, :boolean
  end

  alias {ProjectName}.Domain.Shared.Validator.IValidator

  @behaviour IValidator

  @impl IValidator
  def validate(struct_entity) do
    params = struct_entity |> Map.from_struct()

    %__MODULE__{}
    |> cast(params, [
      :id,
      :active
    ])
    |> case do
      %Ecto.Changeset{valid?: true} -> struct_entity
      changeset -> {:error, get_errors(changeset)}
    end
  end
end
