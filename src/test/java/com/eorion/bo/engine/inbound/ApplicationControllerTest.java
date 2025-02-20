package com.eorion.bo.engine.inbound;

import com.eorion.bo.enhancement.application.adapter.outbound.ApplicationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.camunda.bpm.engine.IdentityService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.util.ResourceUtils;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ApplicationControllerTest {
    @Autowired
    private ApplicationRepository repository;
    @Autowired
    private IdentityService identityService;

    @Autowired
    private ObjectMapper mapper;


    @Autowired
    private MockMvc mockMvc;


    private static final HttpHeaders headers = new HttpHeaders();

    static {
        headers.set("Authorization", "Basic " + Base64.getEncoder().encodeToString("demo:demo".getBytes(StandardCharsets.UTF_8)));
    }

    @Test
    public void createApplicationReturn200() throws Exception {

        var file = ResourceUtils.getFile("classpath:data/normal-save.json");
        var requestBody = new String(Files.readAllBytes(file.toPath()));

        mockMvc.perform(
                        MockMvcRequestBuilders.post("/enhancement/application")
                                .contentType(MediaType.APPLICATION_JSON)
                                .headers(headers)
                                .content(requestBody)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1));
        var application = repository.getById(1);
        Assertions.assertNotNull(application);
        assertEquals("demo,test", application.getAccessUsers());
    }
}
