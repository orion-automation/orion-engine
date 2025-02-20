<template>
  <v-bottom-sheet v-model="addInvolvedUserDialog.display" inset>
    <v-sheet>
      <div class="drawer-title">{{ $t('addInviter') }}</div>
      <div class="drawer-title-line"></div>
      <v-card style="box-shadow: none">
        <v-card-text>
          <div class="d-flex flex-column" style="gap: 10px">
            <template v-if="!readOnly">
              <v-autocomplete
                v-model="addInvolvedUserDialog.searchUser.value"
                :items="addInvolvedUserDialog.searchUser.items"
                :loading="addInvolvedUserDialog.searchUser.loading"
                :search-input.sync="addInvolvedUserDialog.searchUser.searchValue"
                hide-no-data
                hide-details
                hide-selected
                small-chips
                dense
                item-text="showName"
                item-value="id"
                :menu-props="{zIndex:'1000 !important'}"
                :placeholder="$t('searchAndAddInviterWithDot')"
                return-object
              >
              </v-autocomplete>
            </template>
            <v-list>
              <v-list-item v-for="(item,index) in addInvolvedUserDialog.involvedUsers" :key="item.id"
                           style="padding: 0">
                <div class="d-flex flex-row" style="align-items: center;gap: 10px">
                  <v-btn icon x-small @click="onClickDelInvolvedUserSubmit(index,item)">
                    <v-icon color="#FF7754">mdi-minus-circle-outline</v-icon>
                  </v-btn>
                  <div style="flex: 1;gap: 10px" class="d-flex flex-row">
                    <div
                      style="font-size: 14px;color: #444262;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
                      {{ item.firstName }} {{ item.lastName }}
                    </div>
                    <div
                      style="font-size: 14px;color: #B1ABB6;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
                      v-if="item.email"> {{ item.email }}
                    </div>
                  </div>
                </div>
              </v-list-item>
            </v-list>
            <template v-if="!readOnly">
              <div class="d-flex flex-row" style="align-items: center;gap: 20px">
                <v-spacer />
                <v-btn text @click="addInvolvedUserDialog.display=false">{{ $t('back') }}</v-btn>
                <v-btn
                  color="#0F40F5"
                  text
                  :disabled="!addInvolvedUserDialog.searchUser.value"
                  :loading="addInvolvedUserDialog.commitLoading"
                  @click="onClickAddInvolvedUserSubmit">{{ $t('add') }}
                </v-btn>
              </div>
            </template>
          </div>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import InvolvedUserCommon from "@/components/common/involveduser/mixins/index";

export default {
  name: "InvolvedUserDialog",
  mixins: [InvolvedUserCommon]
};
</script>

<style scoped>
.drawer-icon {
  color: #83829a;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drawer-title {
  text-align: center;
  padding: 10px 0 7px 0;
  color: #ff7754;
  font-size: 14px;
}

.drawer-title-line {
  width: 34px;
  height: 3px;
  background-color: #e6e4e6;
  margin: auto;
}

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}
</style>
