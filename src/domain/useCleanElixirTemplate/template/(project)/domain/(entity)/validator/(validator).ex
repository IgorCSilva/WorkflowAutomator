defmodule {ProjectName}.Domain.{EntityName}.Validator.{EntityName}EctoValidator do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  embedded_schema do
  end

  alias Shared.Validator.IValidatorProtocol
  alias {ProjectName}.Domain.{EntityName}.Entity.{EntityName}

  defimpl IValidatorProtocol, for: {EntityName} do
    alias {ProjectName}.Domain.{EntityName}.Validator.{EntityName}EctoValidator

    def validate(entity_struct) do
      params = entity_struct |> Map.from_struct()

      %{EntityName}EctoValidator{}
      |> cast(params, [
      ])
      |> validate_required([])
      |> case do
        %Ecto.Changeset{valid?: true} -> entity_struct
        changeset -> {:error, get_errors(changeset)}
      end
    end
  end
end
