package com.eorion.bo.engine;

import com.eorion.bo.engine.config.CorsConfigurationProperties;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(CorsConfigurationProperties.class)
@Slf4j
@OpenAPIDefinition(servers = {@Server(url = "/", description = "Default Server URL")})
public class OrionAutomationApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrionAutomationApplication.class, args);
    }
}
