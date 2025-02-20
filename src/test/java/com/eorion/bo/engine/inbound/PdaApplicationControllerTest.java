package com.eorion.bo.engine.inbound;

import com.eorion.bo.enhancement.application.adapter.outbound.ApplicationRepository;
import com.eorion.bo.enhancement.application.domain.entity.Application;
import org.camunda.bpm.engine.IdentityService;
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

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PdaApplicationControllerTest {

    @Autowired
    private ApplicationRepository repository;
    @Autowired
    private IdentityService identityService;

    @Autowired
    private MockMvc mockMvc;

    private static final HttpHeaders headers = new HttpHeaders();

    static {
        headers.set("Authorization", "Basic " + Base64.getEncoder().encodeToString("demo:demo".getBytes(StandardCharsets.UTF_8)));
    }


    @Test
    public void getPdaListApplicationReturn200() throws Exception {

        for (int i = 0; i < 5; i++) {
            Application application = new Application();
            application.setType("duo");
            application.setName("name");
            application.setOwner("owner");
            application.setCategory("combination");
            application.setConfigJson(Map.of("key", "value"));
            application.setUserGroup(i % 2 == 0 ? "admin,test" : "group");
            application.setAccessUsers(i % 2 == 0 ? "demo" : "camunda");
            repository.save(application);
        }

        mockMvc.perform(
                        MockMvcRequestBuilders.get("/enhancement/pda-application")
                                .param("userId", "demo1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .headers(headers)
                )
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(3))
                .andDo(print());

    }

}
