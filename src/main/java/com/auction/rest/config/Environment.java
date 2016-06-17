package com.auction.rest.config;

import com.auction.rest.util.Constants;
import com.auction.rest.util.JsonConvertor;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.io.IOUtils;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;

public class Environment {

    private String dialect;
    private String driverClass;
    private String url;
    private String username;
    private String password;
    private static Environment environment;

    private Environment() {}

    @JsonProperty("hibernate.dialect")
    public String getDialect() {
        return dialect;
    }

    public void setDialect(String dialect) {
        this.dialect = dialect;
    }

    @JsonProperty("hibernate.connection.driver_class")
    public String getDriverClass() {
        return driverClass;
    }

    public void setDriverClass(String driverClass) {
        this.driverClass = driverClass;
    }

    @JsonProperty("hibernate.connection.url")
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @JsonProperty("hibernate.connection.username")
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @JsonProperty("hibernate.connection.password")
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public static Environment getInstance() {
        String environmentName = System.getProperty(Constants.ENVIRONMENT_NAME);
        if (environment == null) {
            try {
                InputStream stream = Environment.class.getClassLoader().getResourceAsStream(Constants.ENV_FILE);
                String envJson = IOUtils.toString(stream);
                JSONObject environmentObj = new JSONObject(envJson);
                environment = JsonConvertor.jsonToObject(
                                environmentObj.getJSONObject(environmentName).toString(),
                                Environment.class);
            } catch (IOException | JSONException e) {
                e.printStackTrace();
            }
        }
        return environment;
    }
}