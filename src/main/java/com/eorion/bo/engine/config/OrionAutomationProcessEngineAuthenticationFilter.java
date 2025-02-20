package com.eorion.bo.engine.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.identity.Group;
import org.camunda.bpm.engine.identity.Tenant;
import org.camunda.bpm.engine.rest.dto.ExceptionDto;
import org.camunda.bpm.engine.rest.exception.InvalidRequestException;
import org.camunda.bpm.engine.rest.impl.NamedProcessEngineRestServiceImpl;
import org.camunda.bpm.engine.rest.security.auth.AuthenticationProvider;
import org.camunda.bpm.engine.rest.security.auth.AuthenticationResult;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public class OrionAutomationProcessEngineAuthenticationFilter implements Filter {

    private final ProcessEngine processEngine;

    private static final String[] WHITE_URL = {"/pb", "/enhancement/open"};

    // regexes for urls that may be accessed unauthorized
    protected static final Pattern[] WHITE_LISTED_URL_PATTERNS = new Pattern[]{
            Pattern.compile("^" + NamedProcessEngineRestServiceImpl.PATH + "/?"),
            Pattern.compile("^/identity/verify$")
    };

    // init params
    public static final String AUTHENTICATION_PROVIDER_PARAM = "authentication-provider";
    public static final String SERVLET_PATH_PREFIX = "rest-url-pattern-prefix";

    protected AuthenticationProvider authenticationProvider;
    protected String servletPathPrefix;

    public OrionAutomationProcessEngineAuthenticationFilter(ProcessEngine processEngine) {
        this.processEngine = processEngine;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        String authenticationProviderClassName = filterConfig.getInitParameter(AUTHENTICATION_PROVIDER_PARAM);

        if (authenticationProviderClassName == null) {
            throw new ServletException("Cannot instantiate authentication filter: no authentication provider set. init-param " + AUTHENTICATION_PROVIDER_PARAM + " missing");
        }

        try {
            Class<?> authenticationProviderClass = Class.forName(authenticationProviderClassName);
            authenticationProvider = (AuthenticationProvider) authenticationProviderClass.getDeclaredConstructor().newInstance();
        } catch (ClassNotFoundException e) {
            throw new ServletException("Cannot instantiate authentication filter: authentication provider not found", e);
        } catch (InstantiationException | NoSuchMethodException | InvocationTargetException e) {
            throw new ServletException("Cannot instantiate authentication filter: cannot instantiate authentication provider", e);
        } catch (IllegalAccessException e) {
            throw new ServletException("Cannot instantiate authentication filter: constructor not accessible", e);
        } catch (ClassCastException e) {
            throw new ServletException("Cannot instantiate authentication filter: authentication provider does not implement interface " +
                    AuthenticationProvider.class.getName(), e);
        }

        servletPathPrefix = filterConfig.getInitParameter(SERVLET_PATH_PREFIX);
    }

    private boolean containsWhiteURL(String url) {
        return Arrays.stream(WHITE_URL).anyMatch(url::startsWith);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        String servletPath = servletPathPrefix;
        if (servletPath == null) {
            servletPath = req.getServletPath();
        }
        String requestUrl = req.getRequestURI().substring(req.getContextPath().length() + servletPath.length());

        boolean requiresEngineAuthentication = requiresEngineAuthentication(requestUrl);

        if (!requiresEngineAuthentication || containsWhiteURL(servletPath)) {
            chain.doFilter(request, response);
            return;
        }

        if (processEngine == null) {
            resp.setStatus(Response.Status.NOT_FOUND.getStatusCode());
            ExceptionDto exceptionDto = new ExceptionDto();
            exceptionDto.setType(InvalidRequestException.class.getSimpleName());
            exceptionDto.setMessage("Process engine not available");
            ObjectMapper objectMapper = new ObjectMapper();

            resp.setContentType(MediaType.APPLICATION_JSON);
            objectMapper.writer().writeValue(resp.getWriter(), exceptionDto);
            resp.getWriter().flush();

            return;
        }

        AuthenticationResult authenticationResult = authenticationProvider.extractAuthenticatedUser(req, processEngine);

        if (authenticationResult.isAuthenticated()) {
            try {
                String authenticatedUser = authenticationResult.getAuthenticatedUser();
                List<String> groups = authenticationResult.getGroups();
                List<String> tenants = authenticationResult.getTenants();
                log.debug("authenticatedUser: {}", authenticatedUser);
                setAuthenticatedUser(processEngine, authenticatedUser, groups, tenants);
                chain.doFilter(request, response);
            } finally {
                clearAuthentication(processEngine);
            }
        } else {
            resp.setStatus(Response.Status.UNAUTHORIZED.getStatusCode());
            authenticationProvider.augmentResponseByAuthenticationChallenge(resp, processEngine);
        }

    }

    protected void setAuthenticatedUser(ProcessEngine engine, String userId, List<String> groupIds, List<String> tenantIds) {
        if (groupIds == null) {
            groupIds = getGroupsOfUser(engine, userId);
        }

        if (tenantIds == null) {
            tenantIds = getTenantsOfUser(engine, userId);
        }

        engine.getIdentityService().setAuthentication(userId, groupIds, tenantIds);
    }

    protected List<String> getGroupsOfUser(ProcessEngine engine, String userId) {
        List<Group> groups = engine.getIdentityService().createGroupQuery()
                .groupMember(userId)
                .list();

        var groupIds = new ArrayList<String>();
        for (Group group : groups) {
            groupIds.add(group.getId());
        }
        return groupIds;
    }

    protected List<String> getTenantsOfUser(ProcessEngine engine, String userId) {
        List<Tenant> tenants = engine.getIdentityService().createTenantQuery()
                .userMember(userId)
                .includingGroupsOfUser(true)
                .list();

        var tenantIds = new ArrayList<String>();
        for (Tenant tenant : tenants) {
            tenantIds.add(tenant.getId());
        }
        return tenantIds;
    }

    protected void clearAuthentication(ProcessEngine engine) {
        engine.getIdentityService().clearAuthentication();
    }

    protected boolean requiresEngineAuthentication(String requestUrl) {
        for (Pattern whiteListedUrlPattern : WHITE_LISTED_URL_PATTERNS) {
            Matcher matcher = whiteListedUrlPattern.matcher(requestUrl);
            if (matcher.matches()) {
                return false;
            }
        }

        return true;
    }
}
