package com.eorion.bo.engine.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.support.JdbcTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
public class DatasourceConfiguration {
    @Bean
    @Primary
    @DependsOn("liquibase")
    public PlatformTransactionManager primaryTransactionManager(DataSource dataSource) {
        return new JdbcTransactionManager(dataSource);
    }
}
