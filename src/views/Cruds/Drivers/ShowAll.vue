<template>
  <div class="show_all_content_wrapper" v-if="permissions">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Filter Form =========== -->
      <div class="filter_content_wrapper" :class="{ active: filterFormIsActive }">
        <button class="filter_toggler" @click="filterFormIsActive = !filterFormIsActive">
          <i class="fal fa-times"></i>
        </button>
        <div class="filter_title_wrapper">
          <h5>{{ $t("TITLES.searchBy") }}</h5>
        </div>
        <div class="filter_form_wrapper">
          <form @submit.prevent="submitFilterForm">
            <div class="row justify-content-center align-items-center w-100">
              <!-- Start:: Name Input -->
              <base-input col="3" type="text" :placeholder="$t('PLACEHOLDERS.name')" v-model.trim="filterOptions.name" />
              <!-- End:: Name Input -->

              <!-- Start:: Phone Number Input -->
              <base-input col="3" type="text" :placeholder="$t('PLACEHOLDERS.phoneNumber')"
                v-model.trim="filterOptions.phone" />
              <!-- End:: Name Input -->

              <!-- Start:: Driver Types Input -->
              <base-select-input col="2" :optionsList="driverTypes" :placeholder="$t('PLACEHOLDERS.driverType')"
                v-model="filterOptions.driverType" />
              <!-- End:: Driver Types Input -->

              <!-- Start:: Availablity Status Input -->
              <base-select-input col="2" :optionsList="availabilityStatuses" :placeholder="$t('PLACEHOLDERS.availablity')"
                v-model="filterOptions.isAvailable" />
              <!-- End:: Availablity Status Input -->

              <!-- Start:: Status Input -->
              <base-select-input col="2" :optionsList="activeStatuses" :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.status" />
              <!-- End:: Status Input -->
            </div>

            <div class="btns_wrapper">
              <button class="submit_btn" :disabled="isWaitingRequest">
                <i class="fal fa-search"></i>
              </button>
              <button class="reset_btn" type="button" :disabled="isWaitingRequest" @click="resetFilter">
                <i class="fal fa-redo"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!--  =========== End:: Filter Form =========== -->

      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("TITLES.drivers") }}</h5>
          <button v-if="!filterFormIsActive" class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive">
            <i class="fal fa-search"></i>
          </button>
        </div>
        <div class="title_route_wrapper" v-if="permissions.create">
          <router-link to="/drivers/create">
            {{ $t("BUTTONS.addDriver") }}
          </router-link>
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
      <v-data-table class="thumb" :loading="loading" :loading-text="$t('TABLES.loadingData')" :search="searchValue"
        :headers="tableHeaders" :items="tableRows" item-class="ltr" :items-per-page="paginations.items_per_page"
        hide-default-footer>
        <!-- Start:: No Data State -->
        <template v-slot:no-data>
          {{ $t("TABLES.noData") }}
        </template>
        <!-- Start:: No Data State -->

        <!-- Start:: Item Image -->
        <template v-slot:[`item.profile_image`]="{ item }">
          <div class="table_image_wrapper">
            <h6 class="text-danger" v-if="!item.profile_image"> {{ $t("TABLES.noData") }} </h6>

            <button class="my-1" @click="showImageModal(item.profile_image)" v-else>
              <img class="rounded" :src="item.profile_image" :alt="item.name_ar" width="60" height="60" />
            </button>
          </div>
        </template>
        <!-- End:: Item Image -->

        <!-- Start:: Item Name -->
        <template v-slot:[`item.full_name`]="{ item }">
          <h6 class="text-danger" v-if="!item.full_name"> {{ $t("TABLES.noData") }} </h6>
          <span v-else> {{ item.full_name }} </span>
        </template>
        <!-- End:: Item Name -->

        <!-- Start:: Item Phone -->
        <template v-slot:[`item.phone_number`]="{ item }">
          <h6 class="text-danger" v-if="!item.phone_number"> {{ $t("TABLES.noData") }} </h6>
          <span v-else> {{ item.phone_number }} </span>
        </template>
        <!-- End:: Item Phone -->

        <!-- Start:: Item Email -->
        <template v-slot:[`item.email`]="{ item }">
          <h6 class="text-danger" v-if="!item.email">-</h6>
          <h6 class="text-danger" v-else-if="item.email == 'null' || item.email == ''">-</h6>
          <span v-else> {{ item.email }} </span>
        </template>
        <!-- End:: Item Email -->

        <!-- Start:: Item Address -->
        <template v-slot:[`item.address`]="{ item }">
          <h6 class="text-danger" v-if="!item.address"> {{ $t("TABLES.noData") }} </h6>
          <span v-else> {{ item.address }} </span>
        </template>
        <!-- End:: Item Address -->

        <!-- Start:: Item Driver Type -->
        <template v-slot:[`item.driver_type`]="{ item }">
          <h6 class="text-danger" v-if="!item.driver_type"> {{ $t("TABLES.noData") }} </h6>
          <v-chip v-else color="light-blue darken-2" text-color="white" small>
            <span v-if="item.driver_type == 'washing_polishing'">{{ $t("PLACEHOLDERS.washing_polishing") }}</span>
            <span v-else-if="item.driver_type == 'washing'">{{ $t("PLACEHOLDERS.normal_wash") }}</span>
            <span v-else-if="item.driver_type == 'delivery'">{{ $t("PLACEHOLDERS.delivery") }}</span>
          </v-chip>
        </template>
        <!-- End:: Item Driver Type -->

        <!-- Start:: Item Availability -->
        <template v-slot:[`item.is_available`]="{ item }">
          <div class="activation" dir="ltr" style="z-index: 1">
            <v-switch class="mt-2" color="success" v-model="item.is_available" hide-details
              @change="changeAvailabilityStatus(item)"></v-switch>
          </div>
        </template>
        <!-- End:: Item Availability -->

        <!-- Start:: Activation Status -->
        <template v-slot:[`item.status`]="{ item }">
          <span class="text-success text-h5" v-if="item.status">
            <i class="far fa-check"></i>
          </span>
          <span class="text-danger text-h5" v-else>
            <i class="far fa-times"></i>
          </span>
        </template>
        <!-- End:: Activation Status -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip placement="bottom" v-if="permissions.show">
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>

            <a-tooltip placement="bottom" v-if="permissions.edit">
              <template slot="title">
                <span>{{ $t("BUTTONS.edit") }}</span>
              </template>
              <button class="btn_edit" @click="editItem(item)">
                <i class="fal fa-edit"></i>
              </button>
            </a-tooltip>

            <a-tooltip placement="bottom" v-if="permissions.delete">
              <template slot="title">
                <span>{{ $t("BUTTONS.delete") }}</span>
              </template>
              <button class="btn_delete" @click="selectDeleteItem(item)">
                <i class="fal fa-trash-alt"></i>
              </button>
            </a-tooltip>

            <template v-if="permissions.activate">
              <a-tooltip placement="bottom" v-if="!item.status">
                <template slot="title">
                  <span>{{ $t("BUTTONS.activate") }}</span>
                </template>
                <button class="btn_activate" @click="HandlingItemActivationStatus(item)">
                  <i class="fad fa-check-circle"></i>
                </button>
              </a-tooltip>

              <a-tooltip placement="bottom" v-if="item.status">
                <template slot="title">
                  <span>{{ $t("BUTTONS.deactivate") }}</span>
                </template>
                <button class="btn_deactivate" @click="selectDeactivateItem(item)">
                  <i class="fad fa-times-circle"></i>
                </button>
              </a-tooltip>
            </template>

            <template v-if="!permissions.show && !permissions.edit && !permissions.delete && !permissions.activate">
              <i class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"></i>
            </template>
          </div>
        </template>
        <!-- End:: Actions -->

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: Image Modal -->
          <image-modal v-if="dialogImage" :modalIsOpen="dialogImage" :modalImage="selectedItemImage"
            @toggleModal="dialogImage = !dialogImage" />
          <!-- End:: Image Modal -->

          <!-- Start:: Deactivate Modal -->
          <v-dialog v-model="dialogDeactivate">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToChangeActivationStatus">
                {{ $t("TITLES.DeactivateConfirmingMessage", { name: itemToChangeActivationStatus.full_name }) }}
              </v-card-title>

              <form class="w-100">
                <base-input col="12" rows="3" type="textarea" :placeholder="$t('PLACEHOLDERS.deactivateReason')"
                  v-model.trim="deactivateReason" required />
              </form>

              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="HandlingItemActivationStatus" :disabled="!(!!deactivateReason)">
                  {{ $t("BUTTONS.ok") }}
                </v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogDeactivate = false">{{ $t("BUTTONS.cancel") }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Deactivate Modal -->

          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{ $t("TITLES.DeleteConfirmingMessage", { name: itemToDelete.full_name }) }}
              </v-card-title>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="confirmDeleteItem">{{
                  $t("BUTTONS.ok")
                }}</v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogDelete = false">{{ $t("BUTTONS.cancel") }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Delete Modal -->
        </template>
        <!-- ======================== End:: Dialogs ======================== -->
      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->

    <!-- Start:: Pagination -->
    <template>
      <div class="pagination_container text-center mt-3 mb-0">
        <v-pagination class="py-0" square v-model="paginations.current_page" :length="paginations.last_page"
          :total-visible="6" @input="updateRouterQueryParam($event)" :prev-icon="getAppLocale == 'ar' ? 'fal fa-angle-right' : 'fal fa-angle-left'
            " :next-icon="getAppLocale == 'ar' ? 'fal fa-angle-left' : 'fal fa-angle-right'
    " />
      </div>
    </template>
    <!-- End:: Pagination -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AllDrivers",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),

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

    availabilityStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.available"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.notAvailable"),
          value: 0,
        },
      ];
    },

    activeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.active"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: 0,
        },
      ];
    },
  },

  data() {
    return {
      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      // End:: Loading Data

      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        name: null,
        phone: null,
        driverType: null,
        isAvailable: null,
        status: null,
      },
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.Drivers.serialNumber"),
          value: "id",
          align: "center",
          width: "80",
          sortable: true,
        },
        {
          text: this.$t("TABLES.Drivers.image"),
          value: "profile_image",
          align: "center",
        },
        {
          text: this.$t("TABLES.Drivers.name"),
          value: "full_name",
          align: "center",
        },
        {
          text: this.$t("TABLES.Drivers.phone"),
          value: "phone_number",
          align: "center",
        },
        {
          text: this.$t("TABLES.Drivers.email"),
          value: "email",
          align: "center",
        },
        {
          text: this.$t("TABLES.Drivers.address"),
          value: "address",
          align: "center",
        },
        {
          text: this.$t("TABLES.Drivers.driverType"),
          value: "driver_type",
          align: "center",
        },
        {
          text: this.$t("TABLES.Drivers.createdAt"),
          value: "created_at",
          align: "center",
        },
        {
          text: this.$t("TABLES.Drivers.isAvailable"),
          value: "is_available",
          align: "center",
        },
        {
          text: this.$t("TABLES.Drivers.active"),
          value: "status",
          align: "center",
        },
        {
          text: this.$t("TABLES.Drivers.actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Dialogs Control Data
      dialogImage: false,
      selectedItemImage: null,
      dialogDeactivate: false,
      itemToChangeActivationStatus: null,
      deactivateReason: null,
      dialogDelete: false,
      itemToDelete: null,
      // End:: Dialogs Control Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data

      // Start:: Page Permissions
      permissions: null,
      // Start:: Page Permissions
    };
  },

  watch: {
    // Start:: Page Query Param Watcher To Get Page Data Based On It's Change
    ["$route.query.page"]() {
      this.paginations.current_page = +this.$route.query.page;
      this.setTableRows();
    },
    // End:: Page Query Param Watcher To Get Page Data Based On It's Change
  },

  methods: {
    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/drivers/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.name = null;
      this.filterOptions.phone = null;
      this.filterOptions.driverType = null;
      this.filterOptions.isAvailable = null;
      this.filterOptions.status = null;
      if (this.$route.query.page !== '1') {
        await this.$router.push({ path: '/drivers/all', query: { page: 1 } });
      }
      this.setTableRows();
    },
    // End:: Handel Filter

    // Start:: Set Table Rows
    updateRouterQueryParam(pagenationValue) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: pagenationValue,
        },
      });

      // Scroll To Screen's Top After Get Products
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    async setTableRows() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "admin/driver",
          params: {
            page: this.paginations.current_page,
            keyword: this.filterOptions.name,
            phone_number: this.filterOptions.phone,
            driver_type: this.filterOptions.driverType?.value,
            is_available: this.filterOptions.isAvailable?.value,
            status: this.filterOptions.status?.value,
          },
        });
        this.loading = false;
        // console.log("All Data ==>", res.data.data);
        this.tableRows = res.data.data;
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;
        this.permissions = res.data.permissions;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    // Start:: Control Modals
    showImageModal(image) {
      this.dialogImage = true;
      this.selectedItemImage = image;
    },
    // Start:: Control Modals

    // Start:: Change Availability Status
    async changeAvailabilityStatus(item) {
      try {
        await this.$axios({
          method: "GET",
          url: `main/driver-is-available`,
          params: {
            driver_id: item.id,
            available: +item.is_available,
          },
        });
        this.$message.success(this.$t("MESSAGES.changedSuccessfully"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Change Availability Status

    // ===== Start:: Handling Activation & Deactivation
    selectDeactivateItem(item) {
      this.dialogDeactivate = true;
      this.itemToChangeActivationStatus = item;
    },

    async HandlingItemActivationStatus(selectedItem) {
      this.dialogDeactivate = false;
      let targetItem = this.itemToChangeActivationStatus ? this.itemToChangeActivationStatus : selectedItem;
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      REQUEST_DATA.append("reason", this.deactivateReason);
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `main/user-change-status`,
          params: {
            user_id: targetItem.id,
            status: +!targetItem.status,
            type: "driver",
          },
          data: targetItem.status ? REQUEST_DATA : null,
        });
        this.$message.success(this.$t("MESSAGES.changeActivation"));
        let filteredElemet = this.tableRows.find(element => element.id === targetItem.id);
        filteredElemet.status = !filteredElemet.status;
        this.itemToChangeActivationStatus = null;
        this.deactivateReason = null;
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // ===== End:: Handling Activation & Deactivation

    // ==================== Start:: Crud ====================
    // ===== Start:: Show
    showItem(item) {
      this.$router.push({ path: `/drivers/show/${item.id}` });
    },
    // ===== End:: Show

    // ===== Start:: Edit
    editItem(item) {
      this.$router.push({ path: `/drivers/edit/${item.id}` });
    },
    // ===== End:: Edit

    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },
    async confirmDeleteItem() {
      try {
        await this.$axios({
          method: "POST",
          url: `main/delete-driver`,
          params: {
            driver_id: this.itemToDelete.id,
          },
        });
        this.dialogDelete = false;
        this.tableRows = this.tableRows.filter((item) => {
          return item.id != this.itemToDelete.id;
        });
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // ===== End:: Delete
    // ==================== End:: Crud ====================
  },

  created() {
    // Start:: Fire Methods
    window.addEventListener("click", () => {
      this.filterFormIsActive = false;
    });
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.setTableRows();
    // End:: Fire Methods
  },
};
</script>
