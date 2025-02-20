<template>
  <v-container>
    <div class="top">
      <img src="../../assets/home_header.jpg" style="width: 100%" />
    </div>
    <v-layout
        wrap
        align-center
        justify-center
        align-content-center
        style="
        height: 100vh;
        width: 100%;
        margin: 0;
        padding: 0 35px;
        background-color: #f3f4f9;
      "
    >
      <div class="login-box" style="border: none">
        <v-overlay :value="loading">
          <v-progress-circular indeterminate size="64" />
        </v-overlay>
        <div style="width: 100%;display: flex !important;padding: 30px 30px 0px;align-items: center" class="d-fex flex-row">
          <img src="../../assets/svg/oriori.svg" style="height: 40px" />
          <v-spacer/>
          <img v-if="iconPath" :src="iconPath" style="height: 32px">
        </div>
        <v-form ref="form" @submit.prevent="login">
          <v-text-field
              style="margin: 35px 35px 0 35px"
              v-model="name"
              :rules="nameRules"
              :label="$t('username')"
              required
              autocomplete="false"
          />

          <v-text-field
              style="margin: 0px 28px 0 35px"
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              :label="$t('password')"
              @click:append="showPassword = !showPassword"
              autocomplete="false"
          />
          <div style="margin: 15px 35px 40px 35px">
            <v-btn
                type="submit"
                :class="{ current: tenants.length > 1 }"
                :disabled="!name || !password"
                color="#ffffff"
            >
              <v-icon v-if="tenants.length > 1" size="20" small
              >mdi-check
              </v-icon
              >
              {{ $t('login') }}
            </v-btn>
            <div
                style="
                  color: #fa4f07;
                  font-size: 12px;
                  align-items: center;
                  padding: 10px 0;
                "
                class="d-flex flex-row"
                v-if="hasError"
            >
              <v-icon left color="#FA4F07" small style="position: inherit"
              >mdi-alert-circle-outline
              </v-icon
              >
              {{ $t('usernameOrPasswordError') }}
            </div>
          </div>
        </v-form>
        <div class="d-flex flex-row" style="align-items: center;margin-top: 35px;padding: 0px 35px 24px;font-size:14px">
          <v-spacer/>
          <v-menu bottom offset-y>
            <template #activator="{ on, attrs }">
              <v-btn icon
                     v-bind="attrs"
                     v-on="on">
                <v-icon color="#FF7754" size="14">mdi-translate</v-icon>
                <v-icon color="#83829A" size="12" style="width: 12px">mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="setLocale(item.value)" v-for="item in locale.items" :key="item.value">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-layout>
    <div class="bottom">
      <img src="../../assets/home_footer.jpg" style="width: 100%" />
    </div>
    <v-dialog
        v-model="tenantDialog"
        max-width="290"
        persistent
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ $t('plsSelectTenant') }}
        </v-card-title>
        <v-card-text style="padding-bottom: 0px;padding-top: 20px">
          <v-select
              :items="tenants"
              v-model="tenant"
              return-object
              item-text="name"
              item-value="id"
              :label="$t('plsSelectATenant')"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
              color="green darken-1"
              text
              @click="tenantDialog = false"
          >
            {{ $t('close') }}
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="chooseTenant"
          >
            {{ $t('enter') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import store from "@/store";
import userRequest from "@/api/user";
import {setI18nLocale} from "@/utils/auth";

export default {
  data() {
    return {
      locale:{
        items:[{name:"中文",value:"zh"},{name:"English",value:"en"},{name:"日本語",value:"jp"},{name:"Deutsch",value:"de"},]
      },
      authType: process.env.VUE_APP_AUTH_TYPE,
      loading: false,
      showPassword: false,
      name: "",
      password: "",
      nameRules: [(v) => !!v || this.$t("plsInputUsername")],
      email: "",
      tenant: null,
      passwordRules: [(v) => !!v || this.$t("plsInputPassword")],
      tenantDialog: false,
      tenants: [],
      tenantList: [],
      hasError: false
    };
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.nameRules=[(v) => !!v || this.$t("plsInputUsername")];
        self.passwordRules=[(v) => !!v || this.$t("plsInputPassword")];
      },
    },
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  computed: {
    iconPath() {
      if (window.webConfig && window.webConfig.iconPath) {
        return `${process.env.VUE_APP_ROOT_BASE_API}${window.webConfig.iconPath}`;
      } else {
        return null;
      }
    },
  },
  methods: {
    setLocale(locale) {
      setI18nLocale(locale);
      this.$i18n.locale = locale;
    },
    async chooseTenant() {
      let self = this;
      await store.dispatch("user/setTenantAction", self.tenant);
      this.$router.push({
        path: this.redirect || "/",
        query: this.otherQuery
      });
    },
    async login(isFirst) {
      this.loading = true;

      try {
        await this.$store.dispatch("user/login", {
          username: this.name,
          password: this.password
        });

        let tenants = await userRequest.getTenantListByUser({
          userMember: this.name
        });
        this.tenants = tenants;
        if (isFirst && tenants.length > 1) {
          // 选择tenant
          this.tenant = tenants[0];
          this.tenantDialog = true;
          this.loading = false;
          return;
        } else if (!this.tenant) {
          this.tenant = tenants[0];
        }
        await store.dispatch("user/setTenantAction", this.tenant);
        await store.dispatch("user/getProfile");
        await store.dispatch("user/getGroups");
        await store.dispatch("user/getAuthorization");
      } catch (error) {
        this.hasError = true;
        this.loading = false;
        return;
      }
      this.$router.push({
        path: this.redirect || "/",
        query: this.otherQuery
      });
      this.loading = false;
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
  }
};
</script>

<style scoped>
div.login-box {
  z-index: 9;
  width: 100%;
  line-height: 20px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid rgba(187, 187, 187, 100);
  background-color: rgba(255, 255, 255, 100);
}

/* div.login-box div.mx-auto .v-icon {
  font-size: 68px;
} */

form.v-form {
  /* width: 354px; */
  /* margin-top: 48px; */
}

form.v-form .theme--light.v-input input {
  border-color: rgba(101, 31, 255, 100);
}

form.v-form i.v-icon {
  position: absolute;
  left: 0;
}

form.v-form button.theme--light.v-btn.v-btn--has-bg {
  width: 100%;
  height: 46px;
  border-radius: 8px 8px 8px 8px;
  font-size: 18px;
  text-align: center;
}

form.v-form button.theme--light.v-btn.v-btn--has-bg.v-btn--is-elevated {
  background-color: rgba(49, 38, 81, 1) !important;
  color: #ffffff;
}

form.v-form button.theme--light.v-btn.v-btn--has-bg.v-btn--is-elevated.current {
  background-color: #57928d !important;
}

div.container {
  height: 100vh;
  padding: 0;
  background-color: #f3f4f9;
}

div.tip {
  margin-top: 38px;
  color: rgba(12, 41, 200, 100);
  font-size: 18px;
  cursor: pointer;
  text-align: left;
}

div.app-title {
  text-align: center;
  color: rgb(131, 130, 154);
  font-size: 12px;
}

div.app-title span {
  font-weight: bold;
  color: #007aff;
}

.top {
  position: fixed;
  top: 0;
}

.bottom {
  position: fixed;
  bottom: 0;
}

.enter {
  color: rgba(101, 31, 255, 1);
  font-size: 16px;
}

.enter.disabled {
  color: rgba(0, 0, 0, 0.12);
  pointer-events: none;
  cursor: not-allowed;
}
</style>
