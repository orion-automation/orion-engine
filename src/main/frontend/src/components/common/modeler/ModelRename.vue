<template>
  <v-dialog v-model="display" max-width="500">
    <v-card>
      <v-card-title class="headline" style="color: #444262">
        里程碑重命名
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row style="margin: 0 0 20px 0">
            <v-col style="padding: 0" cols="12">
              <v-text-field
                :label="$t('name')"
                :placeholder="$t('renameToMilestone')"
                v-model="name"
                hide-details
                @keydown.enter="save()"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="padding-bottom: 16px">
        <v-spacer />
        <v-btn text @click="display = false"> {{ $t('cancel') }} </v-btn>
        <v-btn
          :disabled="name === item.name"
          style="color: #ffffff"
          color="#FF7754"
          @click="save()"
        >
          <v-icon size="14" color="#ffffff" style="margin-right: 5px">
            mdi-content-save
          </v-icon>
          {{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import utils from "@/utils/utils";

export default {
  name: "ModelRename",
  components: {},
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      utils: utils,
      name: "",
      display: false,
    };
  },
  watch: {},
  computed: {},

  mounted() {},
  methods: {
    async start() {
      this.display = true;
      this.name = this.item.name;
    },
    getCurrentName(){
      return this.name;
    },
    save() {
      this.$emit("save", this.name);
      this.display = false;
    },
  },
};
</script>

<style scoped>
.checkbox-label {
  color: #444262;
}
</style>
