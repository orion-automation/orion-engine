package com.eorion.bo.engine.config;

import jakarta.servlet.Filter;
import org.camunda.bpm.engine.ProcessEngine;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthenticationConfiguration {
    @Bean
    @ConditionalOnProperty(value = "camunda.bpm.security.enabled", havingValue = "true", matchIfMissing = true)
    public FilterRegistrationBean<OrionAutomationProcessEngineAuthenticationFilter> basicAuthRestFilterRegistrationBean(ProcessEngine processEngine) {
        var registrationBean = new FilterRegistrationBean<OrionAutomationProcessEngineAuthenticationFilter>();
        var filter = new OrionAutomationProcessEngineAuthenticationFilter(processEngine);
        registrationBean.setName("camunda-basic-auth");
        registrationBean.addInitParameter("authentication-provider",
                "org.camunda.bpm.engine.rest.security.auth.impl.HttpBasicAuthenticationProvider");
        registrationBean.setFilter(filter);
        registrationBean.addUrlPatterns("/engine-rest/*", "/enhancement/*");
        registrationBean.setOrder(-1);
        return registrationBean;
    }

    @Bean
    @ConditionalOnProperty(prefix = "camunda.bpm.run.cors", name = "enabled", havingValue = "true")
    public FilterRegistrationBean<Filter> processCorsFilter(CorsConfigurationProperties properties) {
        var registration = new FilterRegistrationBean<>();
        registration.setName("eorion-camunda-cors");
        var corsFilter = new org.apache.catalina.filters.CorsFilter();
        registration.setFilter(corsFilter);
        registration.setOrder(-2);

        registration.addUrlPatterns(properties.getUrlPattern());

        registration.addInitParameter(org.apache.catalina.filters.CorsFilter.PARAM_CORS_ALLOWED_ORIGINS,
                properties.getAllowedOrigins());
        registration.addInitParameter(org.apache.catalina.filters.CorsFilter.PARAM_CORS_ALLOWED_METHODS,
                properties.getAllowedMethods());
        registration.addInitParameter(org.apache.catalina.filters.CorsFilter.PARAM_CORS_ALLOWED_HEADERS,
                properties.getAllowedHeaders());
        registration.addInitParameter(org.apache.catalina.filters.CorsFilter.PARAM_CORS_EXPOSED_HEADERS,
                properties.getExposedHeaders());
        registration.addInitParameter(org.apache.catalina.filters.CorsFilter.PARAM_CORS_SUPPORT_CREDENTIALS,
                String.valueOf(properties.isAllowCredentials()));
        registration.addInitParameter(org.apache.catalina.filters.CorsFilter.PARAM_CORS_PREFLIGHT_MAXAGE,
                String.valueOf(properties.getPreflightMaxAge()));

        return registration;
    }


}
