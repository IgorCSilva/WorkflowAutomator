defmodule {ProjectName}.Domain.{EntityName}.Entity.{EntityName}RuleTest do
  use {ProjectName}.DataCase, async: true

  alias {ProjectName}.Domain.{
    Shared.BasePromotionRule.Base.BPromotionRule,
    {EntityName}.Entity.{EntityName}Rule
  }

  alias Test.Support.TestHelper

  describe "{EntityName} rule unit tests" do

    setup do
      valid_attrs = TestHelper.valid_{entity_name}_rule_attrs

      %{valid_attrs: valid_attrs}
    end
    test "Create {entity_name} rule map when attributes are valids", ctx do
      {entity_name} =
        {EntityName}Rule.new(
          ctx.valid_attrs.id,
          ctx.valid_attrs.description,
          MARKER01
          ctx.valid_attrs.apply_to,
          ctx.valid_attrs.products_id,
          ctx.valid_attrs.categories_id,
          ctx.valid_attrs.remaining_quantity,
          ctx.valid_attrs.quantity_used,
          ctx.valid_attrs.active,
          ctx.valid_attrs.min_price_value,
          ctx.valid_attrs.start_date,
          ctx.valid_attrs.end_date,
          ctx.valid_attrs.inserted_at,
          ctx.valid_attrs.updated_at
        )

      assert %{EntityName}Rule{
        __b__: BPromotionRule,
        description: "Promotion for Carnaval.",
        MARKER02
        apply_to: :specific_categories,
        products_id: [],
        categories_id: ["ba0f4590-246c-11ed-861d-0242ac120000", "ba0f4590-246c-11ed-861d-0242ac120001"],
        remaining_quantity: 10,
        quantity_used: 0,
        active: true,
        min_price_value: 10000,
        start_date: "3022-10-10T13:24:25Z",
        end_date: "3022-10-11T13:24:25Z",
        inserted_at: "3022-10-10T13:24:25Z",
        updated_at: "3022-10-11T13:24:25Z"
      } = {entity_name}
    end

    test "create {entity_name} rule with default values", ctx do
      {entity_name} = {EntityName}Rule.new(
        nil,
        nil,
        MARKER01
        ctx.valid_attrs.apply_to,
        nil,
        nil,
        ctx.valid_attrs.remaining_quantity,
        nil,
        nil,
        ctx.valid_attrs.min_price_value,
        ctx.valid_attrs.start_date,
        ctx.valid_attrs.end_date,
        ctx.valid_attrs.inserted_at,
        ctx.valid_attrs.updated_at
      )

      assert %{EntityName}Rule{
        __b__: BPromotionRule,
        description: "",
        MARKER02
        apply_to: :specific_categories,
        products_id: [],
        categories_id: [],
        remaining_quantity: 10,
        quantity_used: 0,
        active: false,
        min_price_value: 10000,
        start_date: "3022-10-10T13:24:25Z",
        end_date: "3022-10-11T13:24:25Z",
        inserted_at: "3022-10-10T13:24:25Z",
        updated_at: "3022-10-11T13:24:25Z"
      } = {entity_name}
    end

    test "should get error when required params are missing" do
      result = {EntityName}Rule.new(nil, nil, MARKER03nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil)

      assert {:error, errors} = result
      assert %{
        MARKER02
        apply_to: ["can't be blank"],
      } = errors
    end

    test "should get error when params are invalid" do
      result = {EntityName}Rule.new(%{}, %{}, MARKER04%{}, %{}, %{}, %{}, %{}, %{}, %{}, %{}, %{}, %{}, %{}, %{}, %{}, %{})

      assert {:error, errors} = result
      assert %{
        id: ["is invalid"],
        description: ["is invalid"],
        MARKER02
        apply_to: ["is invalid"],
        products_id: ["is invalid"],
        categories_id: ["is invalid"],
        remaining_quantity: ["is invalid"],
        quantity_used: ["is invalid"],
        active: ["is invalid"],
        min_price_value: ["is invalid"],
        start_date: ["is invalid"],
        end_date: ["is invalid"]
      } = errors
    end

    test "should get error when params values are invalid", ctx do
      result = {EntityName}Rule.new(
        ctx.valid_attrs.id,
        ctx.valid_attrs.description,
        MARKER01
        :invalid_apply_to,
        [1,2,3],
        [1,2,3],
        -1,
        -1,
        ctx.valid_attrs.active,
        -5050,
        "3022-10-12 12:00:00",
        "3022-10-11 12:00:00",
        ctx.valid_attrs.inserted_at,
        ctx.valid_attrs.updated_at
      )

      assert {:error, errors} = result
      assert %{
        MARKER02
        apply_to: ["is invalid"],
        products_id: ["is invalid"],
        categories_id: ["is invalid"],
        min_price_value: ["must be greater than or equal to 0"],
        remaining_quantity: ["must be greater than or equal to 0"],
        quantity_used: ["must be greater than or equal to 0"],
        start_date: ["start date can't be greater than end date."],
        end_date: ["end date can't be less than start date."]
      } = errors
    end

    test "Create rule map when start date is in the past", ctx do
      {entity_name} =
        {EntityName}Rule.new(
          ctx.valid_attrs.id,
          ctx.valid_attrs.description,
          MARKER01
          ctx.valid_attrs.apply_to,
          ctx.valid_attrs.products_id,
          ctx.valid_attrs.categories_id,
          ctx.valid_attrs.remaining_quantity,
          ctx.valid_attrs.quantity_used,
          ctx.valid_attrs.active,
          ctx.valid_attrs.min_price_value,
          "1022-10-11T13:24:25Z",
          "3022-10-11T13:24:25Z",
          ctx.valid_attrs.inserted_at,
          ctx.valid_attrs.updated_at
        )

      assert %{EntityName}Rule{
        __b__: BPromotionRule,
        description: "Promotion for Carnaval.",
        MARKER02
        apply_to: :specific_categories,
        products_id: [],
        categories_id: ["ba0f4590-246c-11ed-861d-0242ac120000", "ba0f4590-246c-11ed-861d-0242ac120001"],
        remaining_quantity: 10,
        quantity_used: 0,
        active: true,
        min_price_value: 10000,
        start_date: "1022-10-11T13:24:25Z",
        end_date: "3022-10-11T13:24:25Z",
        inserted_at: "3022-10-10T13:24:25Z",
        updated_at: "3022-10-11T13:24:25Z"
      } = {entity_name}
    end

    test "create period with no values", ctx do
      {entity_name} =
        {EntityName}Rule.new(
          ctx.valid_attrs.id,
          ctx.valid_attrs.description,
          MARKER01
          ctx.valid_attrs.apply_to,
          ctx.valid_attrs.products_id,
          ctx.valid_attrs.categories_id,
          ctx.valid_attrs.remaining_quantity,
          ctx.valid_attrs.quantity_used,
          ctx.valid_attrs.active,
          ctx.valid_attrs.min_price_value,
          nil,
          nil,
          ctx.valid_attrs.inserted_at,
          ctx.valid_attrs.updated_at
        )

      assert %{EntityName}Rule{
        __b__: BPromotionRule,
        description: "Promotion for Carnaval.",
        MARKER02
        apply_to: :specific_categories,
        products_id: [],
        categories_id: ["ba0f4590-246c-11ed-861d-0242ac120000", "ba0f4590-246c-11ed-861d-0242ac120001"],
        remaining_quantity: 10,
        quantity_used: 0,
        active: true,
        min_price_value: 10000,
        start_date: nil,
        end_date: nil,
        inserted_at: "3022-10-10T13:24:25Z",
        updated_at: "3022-10-11T13:24:25Z"
      } = {entity_name}
    end

    test "create period with only start date value", ctx do
      {entity_name} =
        {EntityName}Rule.new(
          ctx.valid_attrs.id,
          ctx.valid_attrs.description,
          MARKER01
          ctx.valid_attrs.apply_to,
          ctx.valid_attrs.products_id,
          ctx.valid_attrs.categories_id,
          ctx.valid_attrs.remaining_quantity,
          ctx.valid_attrs.quantity_used,
          ctx.valid_attrs.active,
          ctx.valid_attrs.min_price_value,
          "1022-10-11T13:24:25Z",
          nil,
          ctx.valid_attrs.inserted_at,
          ctx.valid_attrs.updated_at
        )

      assert %{EntityName}Rule{
        __b__: BPromotionRule,
        description: "Promotion for Carnaval.",
        MARKER02
        apply_to: :specific_categories,
        products_id: [],
        categories_id: ["ba0f4590-246c-11ed-861d-0242ac120000", "ba0f4590-246c-11ed-861d-0242ac120001"],
        remaining_quantity: 10,
        quantity_used: 0,
        active: true,
        min_price_value: 10000,
        start_date: "1022-10-11T13:24:25Z",
        end_date: nil,
        inserted_at: "3022-10-10T13:24:25Z",
        updated_at: "3022-10-11T13:24:25Z"
      } = {entity_name}
    end

    test "create period with only end date value", ctx do
      {entity_name} =
        {EntityName}Rule.new(
          ctx.valid_attrs.id,
          ctx.valid_attrs.description,
          MARKER01
          ctx.valid_attrs.apply_to,
          ctx.valid_attrs.products_id,
          ctx.valid_attrs.categories_id,
          ctx.valid_attrs.remaining_quantity,
          ctx.valid_attrs.quantity_used,
          ctx.valid_attrs.active,
          ctx.valid_attrs.min_price_value,
          nil,
          "3022-10-11T13:24:25Z",
          ctx.valid_attrs.inserted_at,
          ctx.valid_attrs.updated_at
        )

      assert %{EntityName}Rule{
        __b__: BPromotionRule,
        description: "Promotion for Carnaval.",
        MARKER02
        apply_to: :specific_categories,
        products_id: [],
        categories_id: ["ba0f4590-246c-11ed-861d-0242ac120000", "ba0f4590-246c-11ed-861d-0242ac120001"],
        remaining_quantity: 10,
        quantity_used: 0,
        active: true,
        min_price_value: 10000,
        start_date: nil,
        end_date: "3022-10-11T13:24:25Z",
        inserted_at: "3022-10-10T13:24:25Z",
        updated_at: "3022-10-11T13:24:25Z"
      } = {entity_name}
    end

    test "should return error when start date is greater than end date", ctx do
      {entity_name} =
        {EntityName}Rule.new(
          ctx.valid_attrs.id,
          ctx.valid_attrs.description,
          MARKER01
          ctx.valid_attrs.apply_to,
          ctx.valid_attrs.products_id,
          ctx.valid_attrs.categories_id,
          ctx.valid_attrs.remaining_quantity,
          ctx.valid_attrs.quantity_used,
          ctx.valid_attrs.active,
          ctx.valid_attrs.min_price_value,
          "3022-10-12 12:00:00",
          "3022-10-11 12:00:00",
          ctx.valid_attrs.inserted_at,
          ctx.valid_attrs.updated_at
        )

      assert {:error, errors} = {entity_name}
      assert %{
        start_date: ["start date can't be greater than end date."],
        end_date: ["end date can't be less than start date."]
      } = errors
    end

    test "should return error when start date is greate than end date and end date is in the past", ctx do
      {entity_name} =
      {EntityName}Rule.new(
        ctx.valid_attrs.id,
        ctx.valid_attrs.description,
        MARKER01
        ctx.valid_attrs.apply_to,
        ctx.valid_attrs.products_id,
        ctx.valid_attrs.categories_id,
        ctx.valid_attrs.remaining_quantity,
        ctx.valid_attrs.quantity_used,
        ctx.valid_attrs.active,
        ctx.valid_attrs.min_price_value,
        "2020-10-14 12:00:00",
        "2020-10-11 12:00:00",
        ctx.valid_attrs.inserted_at,
        ctx.valid_attrs.updated_at
      )

      assert {:error, errors} = {entity_name}
      assert "end date can't be less than start date." in errors.end_date
      assert %{
        start_date: ["start date can't be greater than end date."]
      } = errors
    end
  end
end
