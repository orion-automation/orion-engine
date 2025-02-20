package com.eorion.bo.engine.config;

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.apache.ibatis.mapping.DatabaseIdProvider;
import org.apache.ibatis.mapping.VendorDatabaseIdProvider;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
@MapperScan(basePackages = {
        "com.eorion.bo.enhancement.application.mapper",
        "com.eorion.bo.enhancement.processdraft.mapper",
        "com.eorion.bo.enhancement.collaboration.mapper",
        "com.eorion.bo.enhancement.delegation.mapper",
        "com.eorion.bo.enhancement.usersetting.mapper"
},
        sqlSessionTemplateRef = "sqlSessionTemplate")
@ConditionalOnClass(MyBatisPlusConfig.class)
public class MyBatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        return interceptor;
    }

    @Bean
    public DatabaseIdProvider databaseIdProvider() {
        VendorDatabaseIdProvider databaseIdProvider = new VendorDatabaseIdProvider();
        Properties properties = new Properties();
        properties.put("PostgreSQL", "postgresql");
        properties.put("MySQL", "mysql");
        properties.put("H2", "h2");
        databaseIdProvider.setProperties(properties);
        return databaseIdProvider;
    }

    /**
     * 配置通用枚举扫描
     */
    @Bean
    public TypeEnumsPackageScanner typeEnumsPackageScanner() {
        return new TypeEnumsPackageScanner();
    }
}