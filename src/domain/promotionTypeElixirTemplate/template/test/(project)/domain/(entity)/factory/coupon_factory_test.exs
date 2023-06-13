defmodule Promotions.Domain.Coupon.Factory.CouponFactoryTest do
  use Promotions.DataCase, async: true

  alias Promotions.Domain.{
    Shared.BasePromotion.Base.BPromotion,
    Shared.BasePromotionRule.Base.BPromotionRule,
    Coupon.Entity.CouponPromotion,
    Coupon.Entity.CouponRule,
    Coupon.Factory.CouponFactory
  }

  alias Test.Support.TestHelper

  describe "Coupon factory unit tests" do

    setup do
      valid_attrs = TestHelper.valid_coupon_promotion_attrs

      %{valid_attrs: valid_attrs}
    end

    test "Create coupon promotion map when attributes are valids", ctx do
      coupon = CouponFactory.build_promotion(ctx.valid_attrs)

      assert %CouponPromotion{
        __b__: BPromotion,
        active: false,
        rules: []
      } = coupon
    end

    test "create coupon promotion with promotion default values", ctx do

      coupon = CouponFactory.build_promotion(ctx.valid_attrs |> Map.drop([:active]))

      assert %CouponPromotion{
        __b__: BPromotion,
        active: true,
        rules: []
      } = coupon

      coupon2 = CouponFactory.build_promotion(%{ctx.valid_attrs | active: nil})

      assert %CouponPromotion{
        __b__: BPromotion,
        active: true,
        rules: []
      } = coupon2
    end

    test "should return error when attributes are invalid", ctx do

      coupon = CouponFactory.build_promotion(%{ctx.valid_attrs | active: %{}})

      assert {:error, errors} = coupon
      assert %{
        active: ["is invalid"]
      } = errors
    end

    test "Create coupon rules when attributes are valids", ctx do
      rules = CouponFactory.build_rules(ctx.valid_attrs.rules)

      assert [
        %CouponRule{
          __b__: BPromotionRule,
          description: "Promotion for Carnaval.",
          min_price_value: 10000,
          active: true,
          apply_to: :specific_categories,
          categories_id: ["ba0f4590-246c-11ed-861d-0242ac120000", "ba0f4590-246c-11ed-861d-0242ac120001"],
          discount: 10.99,
          discount_type: :amount,
          name: "COUPON_TEST",
          end_date: "3022-10-11T13:24:25Z",
          start_date: "3022-10-10T13:24:25Z",
          products_id: [],
          quantity_used: 0,
          remaining_quantity: 10
        },
        %CouponRule{
          __b__: BPromotionRule,
          description: "Coupon promotion for Carnaval.",
          min_price_value: 10000,
          active: true,
          apply_to: :specific_products,
          categories_id: [],
          discount: 9.99,
          discount_type: :amount,
          name: "COUPON_TEST_AGAIN",
          end_date: "3022-10-11T13:24:25Z",
          start_date: "3022-10-10T13:24:25Z",
          products_id: ["ca0f4590-246c-11ed-861d-0242ac120000", "ca0f4590-246c-11ed-861d-0242ac120001"],
          quantity_used: 5,
          remaining_quantity: nil
        }
      ] = rules
    end

    test "Create coupon rules with valid and invalid rules", ctx do

      valid_rule = Enum.at(ctx.valid_attrs.rules, 0)

      rules = CouponFactory.build_rules(
        [
          valid_rule,
          %{valid_rule | name: %{}},
          %{valid_rule | discount_type: %{}},
          %{valid_rule | discount: -1, start_date: :invalid, end_date: :invalid}
        ]
      )

      assert [
        %CouponRule{
          __b__: BPromotionRule,
          description: "Promotion for Carnaval.",
          min_price_value: 10000,
          active: true,
          apply_to: :specific_categories,
          categories_id: ["ba0f4590-246c-11ed-861d-0242ac120000", "ba0f4590-246c-11ed-861d-0242ac120001"],
          discount: 10.99,
          discount_type: :amount,
          name: "COUPON_TEST",
          end_date: "3022-10-11T13:24:25Z",
          start_date: "3022-10-10T13:24:25Z",
          products_id: [],
          quantity_used: 0,
          remaining_quantity: 10
        }
        # {:error, %{name: ["is invalid"]}},
        # {:error, %{discount_type: ["is invalid"]}},
        # {:error,
        #  %{
        #   discount: ["must be greater than 0"],
        #   end_date: ["is invalid"], start_date: ["is invalid"]
        #  }}
      ] = rules
    end

    test "Create coupon rules with no valid rules", ctx do

      valid_rule = Enum.at(ctx.valid_attrs.rules, 0)

      rules = CouponFactory.build_rules(
        [
          %{valid_rule | name: %{}},
          %{valid_rule | discount_type: %{}},
          %{valid_rule | discount: -1, start_date: :invalid, end_date: :invalid}
        ]
      )

      assert {:error, errors} = rules
      assert %{
        rules: [
          %{name: ["is invalid"]},
          %{discount_type: ["is invalid"]},
          %{
            discount: ["must be greater than 0"],
            end_date: ["is invalid"],
            start_date: ["is invalid"]
          }
        ]
      } = errors
    end
  end
end
