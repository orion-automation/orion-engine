package com.eorion.bo.engine.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "camunda.bpm.security.enabled", havingValue = "true", matchIfMissing = true)
public class OpenAPIBasicAuthConfiguration {
    @Bean
    public OpenAPI openAPIWithBasicAuth() {
        return new OpenAPI().components(
                        new Components().addSecuritySchemes("basicAuth",
                                new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("basic")
                        ))
                .addSecurityItem(new SecurityRequirement().addList("basicAuth"));
    }
}
