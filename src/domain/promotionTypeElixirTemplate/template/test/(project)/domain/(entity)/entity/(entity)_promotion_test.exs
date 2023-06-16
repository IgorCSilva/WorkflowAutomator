defmodule {ProjectName}.Domain.{EntityName}.Entity.{EntityName}PromotionTest do
  use {ProjectName}.DataCase, async: true

  alias {ProjectName}.Domain.{
    Shared.BasePromotion.Base.BPromotion,
    {EntityName}.Entity.{EntityName}Promotion
  }

  alias Test.Support.TestHelper

  describe "{EntityName} promotion unit tests" do

    setup do
      valid_attrs = TestHelper.valid_{entity_name}_promotion_attrs

      %{valid_attrs: valid_attrs}
    end

    test "Create {entity_name} promotion map when attributes are valids", ctx do
      {entity_name} = {EntityName}Promotion.new(ctx.valid_attrs.id, ctx.valid_attrs.active, ctx.valid_attrs.inserted_at, ctx.valid_attrs.updated_at)

      assert %{EntityName}Promotion{
        __b__: BPromotion,
        id: "ca0f4590-246c-11ed-861d-0242ac120000",
        type: :{entity_name},
        active: false,
        rules: []
      } = {entity_name}
    end

    test "create {entity_name} promotion with default values" do
      {entity_name} = {EntityName}Promotion.new(nil, nil, nil, nil)

      assert %{EntityName}Promotion{
        __b__: BPromotion,
        id: nil,
        type: :{entity_name},
        active: true,
        rules: []
      } = {entity_name}
    end

    test "Error when params are invalid" do
      result = {EntityName}Promotion.new(%{}, %{}, %{}, %{})

      assert {:error, errors} = result
      assert %{
        id: ["is invalid"],
        active: ["is invalid"]
      } = errors
    end
  end
end
