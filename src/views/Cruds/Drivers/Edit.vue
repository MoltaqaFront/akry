<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editDriver") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Image Upload Input -->
          <base-image-upload-input col="12" identifier="image" :preSelectedImage="data.image.path"
            :placeholder="$t('PLACEHOLDERS.personalImage')" @selectImage="selectImage" />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.name')" v-model.trim="data.name" required />
          <!-- End:: Name Input -->

          <!-- Start:: Phone Input -->
          <base-input col="6" type="tel" :placeholder="$t('PLACEHOLDERS.phoneNumber')" v-model.trim="data.phone"
            required />
          <!-- End:: Phone Input -->

          <!-- Start:: Email Input -->
          <base-input col="6" type="email" :placeholder="$t('PLACEHOLDERS.email')" v-model.trim="data.email" />
          <!-- End:: Email Input -->

          <!-- Start:: Area Input -->
          <base-select-input v-if="allAreasData" col="6" :optionsList="allAreasData"
            :placeholder="$t('PLACEHOLDERS.area')" v-model="data.area" @fireInputEvent="
              getCitiesByAreaId(data.area.id);
            data.city = null;
            data.district = null;
            " required />
          <!-- End:: Area Input -->

          <!-- Start:: City Input -->
          <base-select-input v-if="allCitiesByAreaIdData" col="6" :optionsList="allCitiesByAreaIdData"
            :placeholder="$t('PLACEHOLDERS.city')" v-model="data.city" @fireInputEvent="
              getDistrictsByCityId(data.city.id);
            data.district = null;
            " :disabled="!data.area" required />
          <!-- End:: City Input -->

          <!-- Start:: Districts Input -->
          <base-select-input v-if="allDistrictsByCityIdData" col="6" :optionsList="allDistrictsByCityIdData"
            :placeholder="$t('PLACEHOLDERS.district')" v-model="data.district" :disabled="!data.city" required />
          <!-- End:: Districts Input -->

          <!-- Start:: Address Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.address')" v-model.trim="data.address"
            required />
          <!-- End:: Address Input -->

          <!-- Start:: Driver Type Input -->
          <base-select-input v-if="driverTypes" col="6" :optionsList="driverTypes"
            :placeholder="$t('PLACEHOLDERS.driverType')" v-model="data.driverType" required />
          <!-- End:: Driver Type Input -->

          <!-- Start:: Number Orders Allowed Per Day Input -->
          <base-input col="6" type="number" :placeholder="$t('PLACEHOLDERS.numberOrdersAllowedPerDay')"
            v-model.trim="data.numberOrdersAllowedPerDay" required />
          <!-- End:: Number Orders Allowed Per Day Input -->

          <!-- Start:: Activate Edit Password Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch color="green" :label="$t('PLACEHOLDERS.editPassword')" v-model="data.enableEditPassword"
              hide-details></v-switch>
          </div>
          <!-- End:: Activate Edit Password Switch Input -->

          <div class="col-12" v-if="data.enableEditPassword">
            <div class="row">
              <!-- Start:: Password Input -->
              <base-input col="6" type="password" :placeholder="$t('PLACEHOLDERS.password')" v-model.trim="data.password"
                required />
              <!-- End:: Password Input -->

              <!-- Start:: Confirm Password Input -->
              <base-input col="6" type="password" :placeholder="$t('PLACEHOLDERS.confirmPassword')"
                v-model.trim="data.passwordConfirmation" required />
              <!-- End:: Confirm Password Input -->
            </div>
          </div>

          <!-- Start:: Available Switch Input -->
          <div class="col-md-6 input_wrapper switch_wrapper my-5">
            <v-switch color="green"
              :label="data.available ? $t('PLACEHOLDERS.available') : $t('PLACEHOLDERS.notAvailable')"
              v-model="data.available" hide-details></v-switch>
          </div>
          <!-- End:: Available Switch Input -->

          <!-- Start:: Deactivate Switch Input -->
          <div class="col-md-6 input_wrapper switch_wrapper my-5">
            <v-switch color="green" :label="data.active ? $t('PLACEHOLDERS.active') : $t('PLACEHOLDERS.notActive')"
              v-model="data.active" hide-details></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button class="mt-2" styleType="primary_btn" :btnText="$t('BUTTONS.save')" :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest" />
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

export default {
  name: "EditDriver",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      allAreasData: "ApiGetsModule/allAreasData",
      allCitiesByAreaIdData: "ApiGetsModule/allCitiesByAreaIdData",
      allDistrictsByCityIdData: "ApiGetsModule/allDistrictsByCityIdData",
    }),
    // End:: Vuex Getters

    driverTypes() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.normal_wash"),
          value: "washing",
        },
        // {
        //   id: 2,
        //   name: this.$t("PLACEHOLDERS.delivery"),
        //   value: "delivery",
        // },
        {
          id: 3,
          name: this.$t("PLACEHOLDERS.washing_polishing"),
          value: "washing_polishing",
        },
      ];
    },
  },

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        name: null,
        phone: null,
        email: null,
        area: null,
        city: null,
        district: null,
        address: null,
        driverType: null,
        numberOrdersAllowedPerDay: null,
        enableEditPassword: false,
        password: null,
        passwordConfirmation: null,
        available: true,
        active: true,
      },
      // End:: Data Collection To Send
    };
  },

  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      getAreas: "ApiGetsModule/getAreas",
      getCitiesByAreaId: "ApiGetsModule/getCitiesByAreaId",
      getDistrictsByCityId: "ApiGetsModule/getDistrictsByCityId",
    }),
    // End:: Vuex Actions

    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `main/show-driver`,
          params: {
            driver_id: this.id,
          },
        });
        // Start:: Set Data
        this.data.image.path = res.data.data.profile_image;
        this.data.name = res.data.data.full_name;
        this.data.phone = res.data.data.phone_number;

        if (res.data.data.email == 'null') {
          this.data.email = '';
        } else {
          this.data.email = res.data.data.email;
        }

        this.data.area = res.data.data.region;
        this.data.city = res.data.data.city;
        this.data.district = res.data.data.town;
        this.data.address = res.data.data.address;
        if (res.data.data.driver_type === "washing") {
          this.data.driverType = {
            id: 1,
            name: this.$t("PLACEHOLDERS.normal_wash"),
            value: "washing",
          };
        } else if (res.data.data.driver_type === "delivery") {
          this.data.driverType = {
            id: 2,
            name: this.$t("PLACEHOLDERS.delivery"),
            value: "delivery",
          };
        } else if (res.data.data.driver_type === "washing_polishing") {
          this.data.driverType = {
            id: 3,
            name: this.$t("PLACEHOLDERS.washing_polishing"),
            value: "washing_polishing"
          };
        }
        this.data.numberOrdersAllowedPerDay = res.data.data.number_orders_allowed_per_day;
        this.data.available = res.data.data.is_available;
        this.data.active = res.data.data.status;
        // End:: Set Data
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit

    // Start:: Select Upload Image
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // End:: Select Upload Image

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.name) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.name"));
        return;
      } else if (!this.data.phone) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.phoneNumber"));
        return;
      } else if (!this.data.area) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.area"));
        return;
      } else if (!this.data.city) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.city"));
        return;
      } else if (!this.data.district) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.district"));
        return;
      } else if (!this.data.address) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.address"));
        return;
      } else if (!this.data.driverType) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.driverType"));
        return;
      } else if (!this.data.numberOrdersAllowedPerDay) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.numberOrdersAllowedPerDay"));
        return;
      } else if (this.data.enableEditPassword) {
        if (!this.data.password) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.password"));
          return;
        } else if (this.data.password.length < 6) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.passwordLength"));
          return;
        } else if (!this.data.passwordConfirmation) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.password"));
          return;
        } else if (this.data.passwordConfirmation.length < 6) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.passwordLength"));
          return;
        } else if (
          this.data.password !=
          this.data.passwordConfirmation
        ) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.notEqualPasswords"));
          return;
        } else {
          this.submitForm();
        }
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      if (this.data.image.file) {
        REQUEST_DATA.append("image_data", this.data.image.file);
      }
      REQUEST_DATA.append("full_name", this.data.name);
      REQUEST_DATA.append("phone_number", this.data.phone);
      if (this.data.email) {
        REQUEST_DATA.append("email", this.data.email);
      }
      REQUEST_DATA.append("region_id", this.data.area.id);
      REQUEST_DATA.append("city_id", this.data.city.id);
      REQUEST_DATA.append("town_id", this.data.district.id);
      REQUEST_DATA.append("address", this.data.address);
      REQUEST_DATA.append("driver_type", this.data.driverType.value);
      REQUEST_DATA.append("number_orders_allowed_per_day", this.data.numberOrdersAllowedPerDay);
      if (this.data.enableEditPassword) {
        REQUEST_DATA.append("password", this.data.password);
        REQUEST_DATA.append("password_confirmation", this.data.passwordConfirmation);
      }
      REQUEST_DATA.append("available", +this.data.available);
      REQUEST_DATA.append("status", +this.data.active);
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `main/update-driver/${this.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/drivers/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
  },

  async created() {
    // Start:: Fire Methods
    await this.$store.dispatch("PermissionsModule/checkRoutePermissions", "drivers edit");
    this.getAreas();
    this.getDataToEdit();
    // End:: Fire Methods
  },
};
</script>
