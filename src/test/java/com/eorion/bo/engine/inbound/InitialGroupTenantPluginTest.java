package com.eorion.bo.engine.inbound;

import com.eorion.bo.engine.config.InitialGroupTenantConfiguration;
import org.camunda.bpm.engine.IdentityService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class InitialGroupTenantPluginTest {

    @Autowired
    private IdentityService identityService;

    @Test
    void shouldCreateInitialGroup() {
        var targetGroup = identityService.createGroupQuery().groupId("demo").singleResult();
        assertNotNull(targetGroup);
        assertEquals(InitialGroupTenantConfiguration.GROUP_TYPE, targetGroup.getType());
        var targetUser = identityService.createUserQuery().memberOfGroup("demo").singleResult();
        assertNotNull(targetUser);
    }

    @Test
    void shouldCreateInitialTenant() {
        var targetTenant = identityService.createTenantQuery().tenantId("demo").singleResult();
        assertNotNull(targetTenant);
        var targetUser = identityService.createUserQuery().memberOfTenant("demo").singleResult();
        assertNotNull(targetUser);
    }
}
