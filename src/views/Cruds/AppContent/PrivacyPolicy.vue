<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.privacyPolicy") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Ar Content Text Editor -->
          <base-text-editor
            col="6"
            :placeholder="$t('PLACEHOLDERS.contentAr')"
            v-model.trim="data.contentAr"
            required
          />
          <!-- End:: Ar Content Text Editor -->

          <!-- Start:: En Content Text Editor -->
          <base-text-editor
            col="6"
            :placeholder="$t('PLACEHOLDERS.contentEn')"
            v-model.trim="data.contentEn"
            required
          />
          <!-- Start:: En Content Text Editor -->

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
export default {
  name: "PrivacyPolicy",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        contentAr: null,
        contentEn: null,
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
          url: `admin/pages/privacy-policy`,
        });
        // Start:: Set Data
        this.data.contentAr = res.data.body.page.translations.content.ar;
        this.data.contentEn = res.data.body.page.translations.content.en;
        // End:: Set Data
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.contentAr) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.contentAr"));
        return;
      } else if (!this.data.contentEn) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.contentEn"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = {
        content: {}
      };
      // Start:: Append Request Data
      REQUEST_DATA.content.ar = this.data.contentAr;
      REQUEST_DATA.content.en = this.data.contentEn;
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "PUT",
          url: `admin/pages/privacy-policy`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.savedSuccessfully"));
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
  },

  created() {
    // Start:: Fire Methods
    this.getDataToEdit();
    // End:: Fire Methods
  },
};
</script>
