defmodule {ProjectName}.Domain.{EntityName}.Entity.{EntityName} do
  defstruct(
    # (NEW_STRUCT_FIELD_MARKER)
  )

  @typedoc """
  """
  @type t() :: %__MODULE__{
    # (NEW_TYPE_DEFINITION_FIELD_MARKER)
  }

  @spec new(map()) :: t() | {:error, map()}
  def new({entity_name}) do
    %__MODULE__{
      # (NEW_MODULE_FIELD_MARKER)
    }
    |> validate
  end

  alias Shared.Validator.IValidatorProtocol
  defp validate(struct), do: IValidatorProtocol.validate(struct)
end
