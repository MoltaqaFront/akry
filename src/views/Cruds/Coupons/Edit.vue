<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editCoupon") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            required
          />
          <!-- End:: Name Input -->

          <!-- Start:: Store Input -->
          <base-select-input
            v-if="allStores"
            col="6"
            :optionsList="allStores"
            :placeholder="$t('PLACEHOLDERS.store')"
            v-model="data.store"
            required
          />
          <!-- End:: Store Input -->

          <!-- Start:: Percentage Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.discountPercentage')"
            v-model.trim="data.percentage"
            required
          />
          <!-- End:: Percentage Input -->

          <!-- Start:: Minimum Limit Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.minLimit')"
            v-model.trim="data.minLimit"
            required
          />
          <!-- End:: Minimum Limit Input -->

          <!-- Start:: Maximum Limit Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.maxLimit')"
            v-model.trim="data.maxLimit"
            required
          />
          <!-- End:: Maximum Limit Input -->

          <!-- Start:: Using Number Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.usingNumber')"
            v-model.trim="data.usingNumber"
            required
          />
          <!-- End:: Using Number Input -->

          <!-- Start:: Start Date Input -->
          <base-picker-input
            col="6"
            type="date"
            :disabledDate="disabledDate"
            :placeholder="$t('PLACEHOLDERS.startDate')"
            v-model.trim="data.startDate"
            required
          />
          <!-- End:: Start Date Input -->

          <!-- Start:: End Date Input -->
          <base-picker-input
            col="6"
            type="date"
            :disabledDate="disabledDate"
            :placeholder="$t('PLACEHOLDERS.endDate')"
            v-model.trim="data.endDate"
            required
          />
          <!-- End:: End Date Input -->

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch
              color="green"
              :label="data.active ? $t('PLACEHOLDERS.active') : $t('PLACEHOLDERS.notActive')"
              v-model="data.active"
              hide-details
            ></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";

export default {
  name: "EditCoupon",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        name: null,
        store: null,
        percentage: null,
        minLimit: null,
        maxLimit: null,
        usingNumber: null,
        startDate: null,
        endDate: null,
        active: true,
      },
      // End:: Data Collection To Send
    };
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      allStores: "ApiGetsModule/allStoresData",
    }),
    // End:: Vuex Getters
  },

  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      getStores: "ApiGetsModule/getStores",
    }),
    // End:: Vuex Actions

    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `admin/coupons/${this.id}`,
        });
        // Start:: Set Data
        this.data.name = res.data.body.coupon.name;
        this.data.store = {
          id: res.data.body.coupon.store.id,
          name: res.data.body.coupon.store.title,
        };
        this.data.percentage = res.data.body.coupon.percentage;
        this.data.minLimit = res.data.body.coupon.min_limit;
        this.data.maxLimit = res.data.body.coupon.max_limit;
        this.data.usingNumber = res.data.body.coupon.using_number;
        this.data.startDate = res.data.body.coupon.start_at;
        this.data.endDate = res.data.body.coupon.end_at;
        this.data.active = res.data.body.coupon.is_active;
        // End:: Set Data
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit

    // Start:: Datepicker Disable Previous Days
    disabledDate(current) {
      return current && current < moment().startOf("day");
    },
    // End:: Datepicker Disable Previous Days

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.name) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.name"));
        return;
      } else if (!this.data.store) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.store"));
        return;
      } else if (!this.data.percentage) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.percentage"));
        return;
      } else if (!this.data.minLimit) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.minLimit"));
        return;
      } else if (!this.data.maxLimit) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.maxLimit"));
        return;
      } else if (!this.data.usingNumber) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.usingNumber"));
        return;
      } else if (!this.data.startDate) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.startDate"));
        return;
      } else if (!this.data.endDate) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.endDate"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      // const REQUEST_DATA = new FormData();
      // // Start:: Append Request Data
      // REQUEST_DATA.append("name", this.data.name);
      // REQUEST_DATA.append("store_id", this.data.store.id);
      // REQUEST_DATA.append("percentage", this.data.percentage);
      // REQUEST_DATA.append("min_limit", this.data.minLimit);
      // REQUEST_DATA.append("max_limit", this.data.maxLimit);
      // REQUEST_DATA.append("using_number", this.data.usingNumber);
      // REQUEST_DATA.append("start_at", this.data.startDate);
      // REQUEST_DATA.append("end_at", this.data.endDate);
      // REQUEST_DATA.append("is_active", +this.data.active);
      // // Start:: Append Request Data

      const REQUEST_DATA = {};
      // Start:: Append Request Data
      REQUEST_DATA.name = this.data.name;
      REQUEST_DATA.store_id = this.data.store.id;
      REQUEST_DATA.percentage = this.data.percentage;
      REQUEST_DATA.min_limit = this.data.minLimit;
      REQUEST_DATA.max_limit = this.data.maxLimit;
      REQUEST_DATA.using_number = this.data.usingNumber;
      REQUEST_DATA.start_at = this.data.startDate;
      REQUEST_DATA.end_at = this.data.endDate;
      REQUEST_DATA.is_active = +this.data.active;
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "PUT",
          url: `/admin/coupons/${this.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/coupons/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
  },

  async created() {
    // Start:: Fire Methods
    await this.$store.dispatch("PermissionsModule/checkRoutePermissions", "coupons edit");
    this.getStores();
    this.getDataToEdit();
    // End:: Fire Methods
  },
};
</script>
