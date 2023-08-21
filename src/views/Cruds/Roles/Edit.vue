<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editRole") }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Name Input -->
          <base-input
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            required
          />
          <!-- End:: Name Input -->

          <!-- Start:: Permissions -->
          <div class="col-12">
            <div class="row" v-if="allSystemPermissions">
              <div 
                v-for="permission in allSystemPermissions"
                :key="permission.id"
                class="col-md-4"
              >
                <div class="permission_card_wrapper">
                  <p class="card_title"> {{ permission.parent_key }} </p>
                  <div class="card_body">
                    <div class="row">
                      <div 
                        v-for="item in permission.permissions"
                        :key="item.id"
                        class="col-6"
                      >
                        <div class="input_wrapper switch_wrapper my-5">
                          <v-switch
                            color="green"
                            :label="item.name"
                            :value="item.id"
                            v-model="data.permissions"
                            hide-details
                          ></v-switch>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End:: Permissions -->

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
import {mapActions, mapGetters} from "vuex";

export default {
  name: "EditRole",

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

      // Start:: System Permissions
      systemPermissions: null,
      // End:: System Permissions

      // Start:: Data Collection To Send
      data: {
        name: null,
        permissions: [],
      },
      // End:: Data Collection To Send
    };
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      allSystemPermissions: "PermissionsModule/allSystemPermissions",
    }),
    // End:: Vuex Getters
  },

  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      getAllSystemPermissions: "PermissionsModule/getAllSystemPermissions",
    }),
    // End:: Vuex Actions

    // Start:: Get System Permissions
    async getSystemPermissions() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `admin/permissions`,
        });
        this.systemPermissions = res.data.body.permissions;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get System Permissions

    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `admin/roles/${this.id}`,
        });
        // console.log( "DATA TO EDIT =>", res.data.body );

        // Start:: Set Data
        this.data.name = res.data.body.role.name;

        res.data.body.role.permissions.forEach(element => {
          element.permissions.forEach(item => {
            this.data.permissions.push(item.id);
          });
        });
        // End:: Set Data
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.name) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.name"));
        return;
      } else if (this.data.permissions.length === 0) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.permissions"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      // let selectedPermissions = this.data.permissions.map(item => {
      //   return item.id;
      // });

      const REQUEST_DATA = {};
      // Start:: Append Request Data
      REQUEST_DATA.name = this.data.name;
      REQUEST_DATA.permissions = this.data.permissions;
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "PUT",
          url: `admin/roles/${this.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/roles/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.errors);
      }
    },
    // End:: Submit Form
  },

  async created() {
    // Start:: Fire Methods
    await this.$store.dispatch("PermissionsModule/checkRoutePermissions", "roles edit");
    if(this.id == 1) {
      this.$router.back();
    }
    this.getAllSystemPermissions();
    this.getDataToEdit();
    // End:: Fire Methods
  },
};
</script>
