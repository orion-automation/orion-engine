package com.eorion.bo.engine.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.impl.identity.Authentication;
import org.springframework.stereotype.Component;

@Component
public class MybatisPlusInsertUpdateHandler implements MetaObjectHandler {

    private final IdentityService identityService;
    public MybatisPlusInsertUpdateHandler(IdentityService identityService) {
        this.identityService = identityService;
    }

    @Override
    public void insertFill(MetaObject metaObject) {
        Authentication authentication = identityService.getCurrentAuthentication();
        String userId = authentication == null ? null : authentication.getUserId();
        Object createdTimestamp = getFieldValByName("createdTs", metaObject);
        if (createdTimestamp == null) {
            setFieldValByName("createdTs", System.currentTimeMillis(), metaObject);
            setFieldValByName("updatedTs", System.currentTimeMillis(), metaObject);
        } else {
            setFieldValByName("updatedTs", createdTimestamp, metaObject);
        }

        Object createdBy = getFieldValByName("createdBy", metaObject);
        if (createdBy == null && userId != null) {
            setFieldValByName("createdBy", userId, metaObject);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        Authentication authentication = identityService.getCurrentAuthentication();
        String userId = authentication == null ? null : authentication.getUserId();
        setFieldValByName("updatedTs", System.currentTimeMillis(), metaObject);

        Object updatedBy = getFieldValByName("updatedBy", metaObject);
        if (updatedBy == null && userId != null) {
            setFieldValByName("updatedBy", userId, metaObject);
        }
    }
}