package com.eorion.bo.engine.adapter.inbound;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MultivaluedHashMap;
import jakarta.ws.rs.core.MultivaluedMap;
import org.camunda.bpm.cockpit.impl.plugin.base.dto.ProcessDefinitionStatisticsDto;
import org.camunda.bpm.cockpit.impl.plugin.base.dto.query.ProcessDefinitionStatisticsQueryDto;
import org.camunda.bpm.cockpit.impl.plugin.resources.ProcessDefinitionRestService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.rest.dto.CountResultDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/enhancement/base/process-definition")
public class OrionProcessDefinitionController extends ProcessDefinitionRestService {

    public OrionProcessDefinitionController(ProcessEngine processEngine) {
        super(processEngine.getName());
    }

    @GetMapping("/statistics")
    public List<ProcessDefinitionStatisticsDto> queryStatistics(HttpServletRequest request,
                                                                @QueryParam("firstResult") Integer firstResult,
                                                                @QueryParam("maxResults") Integer maxResults) {
        var queryDto = new ProcessDefinitionStatisticsQueryDto(convertToMultivaluedMap(request));
        configureExecutionQuery(queryDto);
        queryDto.setFirstResult(firstResult != null && firstResult >= 0 ? firstResult : 0);
        queryDto.setMaxResults(maxResults != null && maxResults > 0 ? maxResults : Integer.MAX_VALUE);

        return getQueryService().executeQuery("selectPDStatistics", queryDto);

    }

    @GetMapping("/statistics-count")
    public CountResultDto getStatisticsCount(HttpServletRequest request) {
        var queryDto = new ProcessDefinitionStatisticsQueryDto(convertToMultivaluedMap(request));
        configureExecutionQuery(queryDto);
        long count = getQueryService().executeQueryRowCount("selectPDStatisticsCount", queryDto);
        return new CountResultDto(count);
    }

    private MultivaluedMap<String, String> convertToMultivaluedMap(HttpServletRequest request) {
        MultivaluedMap<String, String> multiValueMap = new MultivaluedHashMap<>();

        for (Map.Entry<String, String[]> entry : request.getParameterMap().entrySet()) {
            for (String value : entry.getValue()) {
                multiValueMap.add(entry.getKey(), value);
            }
        }
        return multiValueMap;
    }
}
