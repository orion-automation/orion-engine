package com.eorion.bo.engine.config;

import org.camunda.bpm.engine.IdentityService;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class InitialGroupTenantConfiguration implements SmartInitializingSingleton {
    @Value("${eorion.bo.engine.init.group-id}")
    private String groupId;
    @Value("${eorion.bo.engine.init.group-name}")
    private String groupName;
    @Value("${eorion.bo.engine.init.tenant-id}")
    private String tenantId;
    @Value("${camunda.bpm.admin-user.id}")
    private String adminUserId;

    public static final String GROUP_TYPE = "dpacoe";

    private final IdentityService identityService;

    public InitialGroupTenantConfiguration(IdentityService identityService) {
        this.identityService = identityService;
    }


    @Override
    public void afterSingletonsInstantiated() {
        var user = identityService.createUserQuery().userId(adminUserId).singleResult();
        if (user != null) {
            if (groupId != null) {
                var existedGroup = identityService.createGroupQuery().groupId(groupId).count();
                if (existedGroup == 0) {
                    var group = identityService.newGroup(groupId);
                    group.setType(GROUP_TYPE);
                    group.setName(groupName);
                    identityService.saveGroup(group);
                    identityService.createMembership(adminUserId, groupId);
                }
            }

            if (tenantId != null) {
                var existedTenant = identityService.createTenantQuery().tenantId(tenantId).count();
                if (existedTenant == 0) {
                    var tenant = identityService.newTenant(tenantId);
                    identityService.saveTenant(tenant);
                    identityService.createTenantUserMembership(adminUserId, tenantId);
                }
            }
        }
    }
}
