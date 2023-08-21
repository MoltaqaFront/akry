<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">

          <!-- Start:: Phone Input -->
          <base-input col="6" type="tel" :placeholder="$t('PLACEHOLDERS.phone')" v-model.trim="data.first_phone" />
          <!-- End:: Phone Input -->

          <!-- Start:: Another Phone Input -->
          <base-input col="6" type="tel" :placeholder="$t('PLACEHOLDERS.anotherPhone')"
            v-model.trim="data.second_phone" />
          <!-- End:: Another Phone Input -->

          <!-- Start:: Tax Percentage Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.taxPercentage')"
            v-model.trim="data.taxPercentage" />
          <!-- End:: Tax Percentage Input -->

          <!-- Start:: Tax Percentage Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.app_commission')"
            v-model.trim="data.app_commission" />
          <!-- End:: Tax Percentage Input -->

          <!-- Start:: Delivery Price Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.deliveryPrice')"
            v-model.trim="data.deliveryPrice" />
          <!-- End:: Delivery Price Input -->

          <!-- Start:: Driver's Daily Orders Amount Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.coefficient')" v-model.trim="data.coefficient" />
          <!-- End:: Driver's Daily Orders Amount Input -->

          <!-- Start:: Driver's Daily Orders Amount Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.reservation_cancel_time')"
            v-model.trim="data.reservation_cancel_time" />
          <!-- End:: Driver's Daily Orders Amount Input -->

          <!-- Start:: Driver's Daily Orders Amount Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.fast_order_cancel_time')"
            v-model.trim="data.fast_order_cancel_time" />
          <!-- End:: Driver's Daily Orders Amount Input -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button class="mt-2" styleType="primary_btn" :btnText="$t('BUTTONS.save')" :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest" />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- End:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "GeneralSettings",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        first_phone: '',
        second_phone: '',
        taxPercentage: null,
        deliveryPrice: null,
        coefficient: null,
        app_commission: null,
        reservation_cancel_time: null,
        fast_order_cancel_time: null
      },
      // End:: Data Collection To Send
    };
  },

  methods: {
    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `admin/settings?dashboard=true`,
        });
        // Start:: Set Data
        this.data.first_phone = res.data.body.settings.contact_us_numbers.phone1;
        this.data.second_phone = res.data.body.settings.contact_us_numbers.phone2;
        this.data.app_commission = res.data.body.settings.app_percentage;
        this.data.taxPercentage = res.data.body.settings.tax_percentage;
        this.data.deliveryPrice = res.data.body.settings.delivery_price;
        this.data.coefficient = res.data.body.settings.delivery_range_price;
        this.data.reservation_cancel_time = res.data.body.settings.reservation_cancel_time;
        this.data.fast_order_cancel_time = res.data.body.settings.fast_order_cancel_time;
        // End:: Set Data
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit

    // Start:: Submit Form
    async submitForm() {
      this.isWaitingRequest = !this.isWaitingRequest;

      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("contact_us_numbers[phone1]", this.data.first_phone);
      REQUEST_DATA.append("contact_us_numbers[phone2]", this.data.second_phone);
      REQUEST_DATA.append("tax_percentage", this.data.taxPercentage);
      REQUEST_DATA.append("app_percentage", this.data.app_commission);
      REQUEST_DATA.append("delivery_price", this.data.deliveryPrice);
      REQUEST_DATA.append("delivery_range_price", this.data.coefficient);
      REQUEST_DATA.append("fast_order_cancel_time", this.data.fast_order_cancel_time);
      REQUEST_DATA.append("reservation_cancel_time", this.data.reservation_cancel_time);
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "PUT",
          url: `admin/settings?dashboard=true`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.savedSuccessfully"));
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.errors);
      }
    },
    // End:: Submit Form

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.fast_order_cancel_time) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.fast_order_cancel_time"));
        return;
      } else if (!this.data.reservation_cancel_time) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.reservation_cancel_time"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs
  },

  created() {
    // Start:: Fire Methods
    this.getDataToEdit();
    // End:: Fire Methods
  },
};
</script>
