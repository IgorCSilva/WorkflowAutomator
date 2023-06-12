defmodule {ProjectName}.Domain.{EntityName}.Validator.{EntityName}RuleEctoValidator do

  use Ecto.Schema
  import Ecto.Changeset
  import {ProjectName}.Util.Errors

  @primary_key false
  embedded_schema do
    (NEW_ECTO_VALIDATOR_SCHEMA_FIELD_MARKER)
  end

  alias {ProjectName}.Domain.Shared.Validator.IValidator

  @behaviour IValidator

  @impl IValidator
  def validate(struct_entity) do
    params = struct_entity |> Map.from_struct()

    %__MODULE__{}
    |> cast(params, [
      (NEW_ECTO_VALIDATOR_CAST_FIELD_MARKER)
    ])
    |> validate_required([(NEW_ECTO_VALIDATOR_REQUIRED_FIELD_MARKER)])
    |> case do
      %Ecto.Changeset{valid?: true} -> struct_entity
      changeset -> {:error, get_errors(changeset)}
    end
  end
end
