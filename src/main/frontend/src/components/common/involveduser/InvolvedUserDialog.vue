<template>
  <v-dialog v-model="addInvolvedUserDialog.display" max-width="600">
    <v-card>
      <v-card-title>
        {{ $t('addInviteUser') }}
      </v-card-title>
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
              :placeholder="$t('inputKeyToSearchUser')"
              prepend-icon="mdi-account-search-outline"
              return-object
            >
            </v-autocomplete>
            <div class="d-flex flex-row" style="align-items: center;gap: 20px">
              <v-spacer />
              <v-btn text @click="addInvolvedUserDialog.display=false">{{ $t('cancel') }}</v-btn>
              <v-btn
                color="#FF7754" class="text-white"
                :disabled="!addInvolvedUserDialog.searchUser.value"
                :loading="addInvolvedUserDialog.commitLoading"
                @click="onClickAddInvolvedUserSubmit">{{ $t('add') }}
              </v-btn>
            </div>
          </template>
          <el-table :data="addInvolvedUserDialog.involvedUsers" max-height="200">
            <el-table-column prop="id" :label="$t('nowInviter')" />
            <el-table-column :label="$t('nameUser')">
              <template slot-scope="props">
                {{ props.row.firstName }} {{ props.row.lastName }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('opt')" width="100" v-if="!readOnly">
              <template slot-scope="props">
                <v-btn icon x-small @click="onClickDelInvolvedUserSubmit(props.$index,props.row)">
                  <v-icon>mdi-minus-circle-outline</v-icon>
                </v-btn>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import InvolvedUserCommon from "@/components/common/involveduser/mixins/index";

export default {
  name: "InvolvedUserDialog",
  mixins: [InvolvedUserCommon]
};
</script>

<style scoped>

</style>
