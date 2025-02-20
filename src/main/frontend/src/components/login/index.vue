<template>
  <div
    class="d-flex flex-column"
    style="align-items: center;justify-items: center;padding-top: 10%;background: #F3F4F9;height: 100vh;"
  >
    <div class="d-flex flex-column" style="align-items: center;justify-items: center">
      <img src="../../assets/svg/oriori.svg" style="height: 50px;">
      <div class="login-box" style="margin-top: 30px;background: white">
        <v-overlay :value="loading" />
        <v-form ref="form" class="mx-auto" @submit.prevent="login">
          <v-row>
            <v-col cols="12" sm="12">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                :label="$t('username')"
                required
                autocomplete="false"
              />
            </v-col>

            <v-col cols="12" sm="12">
              <v-text-field
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                :label="$t('password')"
                @click:append="showPassword = !showPassword"
                autocomplete="false"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">
              <v-btn type="submit" :disabled="!name || !password" color="#444262" small>{{ $t('login') }}</v-btn>
              <div style="color: #FA4F07;font-size: 12px;align-items: center;
padding: 10px 0" class="d-flex flex-row"
              v-if="hasError">
                <v-icon left color="#FA4F07" small>mdi-alert-circle-outline</v-icon>
                {{ $t('usernameOrPasswordError') }}</div>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <img v-if="iconPath" :src="iconPath" style="height: 36px;margin-top: 30px">
    </div>
    <div
      class="d-flex flex-row"
      style="align-items: center;justify-items: center;position: absolute;bottom: 0;left: 0;width: 100%;padding: 10px"
    >
      <div style="font-size: 12px;">
        <b style="color: #268dfe">orion automation</b> |
        CE Ver {{ version }}
      </div>
      <v-spacer />
      <div style="color: rgba(131, 130, 154, 1);font-size: 12px;">{{ $t('authType') }}{{ authType }}</div>
    </div>
    <v-dialog
      v-model="tenantDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{ $t('plsSelectTenant') }}
        </v-card-title>
        <v-card-text style="padding-bottom: 0px;padding-top: 20px">
          <v-select
            :items="tenantList"
            v-model="tenant"
            return-object
            item-text="name"
            item-value="id"
            :label="$t('plsSelectATenant')"
            outlined
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
            {{ $t('login') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import store from "@/store";
import config from "../../../package.json";
import userRequest from "@/api/user";

export default {
  name: "Login",
  data() {
    return {
      version: config.version,
      authType: process.env.VUE_APP_AUTH_TYPE,
      loading: false,
      hasError: false,
      showPassword: false,
      name: "",
      password: "",
      nameRules: [(v) => !!v || this.$t("plsInputUsername")],
      email: "",
      passwordRules: [(v) => !!v || this.$t("plsInputPassword")],
      tenantDialog: false,
      tenantList: [],
      tenant: {},
    };
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.nameRules=[(v) => !!v || self.$t("plsInputUsername")];
        self.passwordRules=[(v) => !!v || self.$t("plsInputPassword")];
      },
    },
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
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
    async chooseTenant() {
      let self = this;
      await store.dispatch("user/setTenantAction", self.tenant);
      if (this.$route.query.redirect) {
        let redirect = this.$route.query.redirect;
        this.$router.push(redirect);
      } else {
        this.$router.push("/");
      }
    },
    async login() {
      //   var result = this.$refs.form.validate();
      this.loading = true;
      try {
        await this.$store.dispatch("user/login", {
          username: this.name,
          password: this.password,
        });
        await store.dispatch("user/getProfile");
        await store.dispatch("user/getGroups");
        await store.dispatch("user/getAuthorization");
      } catch (error) {
        console.log(error);
        this.hasError = true;
        this.loading = false;
        return;
      }
      let tenants=await userRequest.getTenantListByUser({"userMember": this.name});
      if (tenants.length > 0){
        if (tenants.length===1){
          await store.dispatch("user/setTenantAction",tenants[0]);
          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery,
          });
        }else {
          // 选择
          this.tenant = tenants[0];
          this.tenantList = tenants;
          this.tenantDialog = true;
        }
      }else {
        await store.dispatch("user/setTenantAction",{id:"",name:""});
        this.$router.push({
          path: this.redirect || "/",
          query: this.otherQuery,
        });
      }
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
    },
  },
};
</script>

<style scoped>
div.login-box {
  padding: 3rem;
  line-height: 20px;
  border-radius: 16px 16px 16px 16px;
  text-align: center;
  background-color: rgba(255, 255, 255, 100);
}

div.login-box div.mx-auto {
  width: 68px;
  height: 68px;
  margin-top: 61px;
}

div.login-box div.mx-auto .v-icon {
  font-size: 68px;
}

form.v-form {
  width: 280px;
}

form.v-form .theme--light.v-input input {
  border-color: rgba(101, 31, 255, 100);
}

form.v-form button.v-btn {
  width: 100%;
  height: 48px;
  background-color: rgba(12, 41, 200, 100);
  color: rgba(255, 255, 255, 100);
}

div.container.container--fluid {
  padding: 0;
  background-color: #444262;
}

div.tip {
  margin-top: 38px;
  color: rgba(12, 41, 200, 100);
  font-size: 18px;
  cursor: pointer;
  text-align: left;
}

div.app-title {
  color: rgba(255, 255, 255, 100);
  margin-top: 40px;
  text-align: center;
}

div.app-title span.bold {
  font-weight: bold;
}

div.version {
  position: fixed;
  bottom: 20px;
  text-align: center;
  left: 0;
  right: 0;
  color: rgba(255, 255, 255, 100);
  font-size: 14px;
}
</style>
