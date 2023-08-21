<template>
  <div class="crud_form_wrapper single_show_content_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showDriver", { name: data.name }) }}</h4>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <!-- ==== Start:: Status Badges ==== -->
      <div class="badges_wrapper justify-content-between">
        <div class="wrapper">
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.numberOfVisits", { number: data.numberOfVisits }) }}
          </v-chip>
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.lastVisit", { date: data.lastVisit }) }}
          </v-chip>
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.created_at", { date: data.created_at }) }}
          </v-chip>
        </div>

        <div class="wrapper">
          <v-chip :color="data.active ? 'green' : 'red'" text-color="white">
            {{ data.active ? $t("STATUS.active") : $t("STATUS.notActive") }}
          </v-chip>
          <v-chip :color="data.available ? 'green' : 'red'" text-color="white">
            {{ data.available ? $t("STATUS.available") : $t("STATUS.notAvailable") }}
          </v-chip>
        </div>
      </div>
      <!-- ==== End:: Status Badges ==== -->

      <!-- ==== Start:: Driver Main Data ==== -->
      <form>
        <div class="row">
          <!-- Start:: Image Upload Input -->
          <base-image-upload-input col="12" identifier="driver_image" :placeholder="$t('PLACEHOLDERS.personalImage')"
            :preSelectedImage="data.image" disabled />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Name Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.name')" v-model.trim="data.name" readonly />
          <!-- End:: Name Input -->

          <!-- Start:: Phone Input -->
          <base-input col="6" type="tel" :placeholder="$t('PLACEHOLDERS.phone')" v-model.trim="data.phone" readonly />
          <!-- End:: Phone Input -->

          <!-- Start:: Email Input -->
          <base-input col="6" type="email" :placeholder="$t('PLACEHOLDERS.email')" v-model.trim="data.email" readonly />
          <!-- End:: Email Input -->

          <!-- Start:: Area Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.area')" v-model.trim="data.area" readonly />
          <!-- End:: Area Input -->

          <!-- Start:: City Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.city')" v-model.trim="data.city" readonly />
          <!-- End:: City Input -->

          <!-- Start:: District Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.district')" v-model.trim="data.district"
            readonly />
          <!-- End:: District Input -->

          <!-- Start:: Address Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.address')" v-model.trim="data.address"
            readonly />
          <!-- End:: Address Input -->

          <!-- Start:: Driver Type Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.driverType')" v-model.trim="data.driverType"
            readonly />
          <!-- End:: Driver Type Input -->

          <!-- Start:: Number Orders Allowed Per Day Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.numberOrdersAllowedPerDay')"
            v-model.trim="data.numberOrdersAllowedPerDay" readonly />
          <!-- End:: Number Orders Allowed Per Day Input -->

          <!-- Start:: Joining Date Input -->
          <base-input col="6" type="text" :placeholder="$t('PLACEHOLDERS.joiningDate')" v-model.trim="data.joiningDate"
            readonly />
          <!-- End:: Joining Date Input -->
        </div>
      </form>
      <!-- ==== End:: Driver Main Data ==== -->

      <!-- ==== Start:: Driver Deactivate Reasons ==== -->
      <div class="table_content" v-if="data.banReasonsCount > 0">
        <h6 class="table_title mt-5 mb-4 text-danger"> {{ $t("TITLES.deactivateHistory") }} </h6>
        <v-simple-table class="border border-danger">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center" v-for="item in banReasonsTableHeaders" :key="item.text"
                  :style="{ 'width': `${item.width}px` }">
                  {{ item.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center text-danger" v-if="data.banReasons.length === 0">
                <td colspan="7">
                  {{ $t("TABLES.noData") }}
                </td>
              </tr>
              <template v-else>
                <tr class="text-center" v-for="item in data.banReasons" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.reason }}</td>
                </tr>
              </template>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <!-- ==== End:: Driver Deactivate Reasons ==== -->
    </div>
    <!-- End:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "SingleDriver",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      // Start:: Loading Data
      isWaitingRequest: false,
      // End:: Loading Data

      // Start:: Table Data
      banReasonsTableHeaders: [
        { text: this.$t("TABLES.DeactivateReasons.serialNumber"), width: "80" },
        { text: this.$t("TABLES.DeactivateReasons.reason") },
      ],
      // End:: Table Data

      // Start:: Data
      data: {
        active: false,
        available: false,
        numberOfVisits: null,
        lastVisit: null,
        created_at: null,
        image: null,
        name: null,
        phone: null,
        email: null,
        area: null,
        city: null,
        district: null,
        address: null,
        driverType: null,
        numberOrdersAllowedPerDay: null,
        joiningDate: null,
        banReasonsCount: 0,
        banReasons: [],
      },
      // End:: Data
    };
  },

  methods: {
    // Start:: Get Data To Show
    async getDataToShow() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `admin/driver/${this.id}`,
          // params: {
          //   driver_id: this.id,
          // }
        });
        // console.log("DATA =>", res.data.data);

        this.data.active = res.data.data.status;
        this.data.available = res.data.data.is_available;
        this.data.numberOfVisits = res.data.data.driver_login_count;
        this.data.lastVisit = res.data.data.last_driver_logged;
        this.data.created_at = res.data.data.created_at;
        this.data.image = res.data.data.profile_image;
        this.data.name = res.data.data.full_name;
        this.data.phone = res.data.data.phone_number;
        this.data.email = res.data.data.email;
        this.data.area = res.data.data.region.name;
        this.data.city = res.data.data.city.name;
        this.data.district = res.data.data.town.name;
        this.data.address = res.data.data.address;
        this.data.driverType = res.data.data.driver_type;
        this.data.numberOrdersAllowedPerDay = res.data.data.number_orders_allowed_per_day;
        this.data.joiningDate = res.data.data.created_at;
        this.data.banReasonsCount = res.data.data.ban_count;
        this.data.banReasons = res.data.data.ban_reasons;

      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Show
  },

  created() {
    // Start:: Fire Methods
    this.getDataToShow();
    // End:: Fire Methods
  },
};
</script>
