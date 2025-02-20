```text
  _____   ______ _____  _____  __   _      _______ _     _ _______  _____  _______ _______ _______ _____  _____  __   _
 |     | |_____/   |   |     | | \  |      |_____| |     |    |    |     | |  |  | |_____|    |      |   |     | | \  |
 |_____| |    \_ __|__ |_____| |  \_|      |     | |_____|    |    |_____| |  |  | |     |    |    __|__ |_____| |  \_|
```

# ORION Engine

ORION Engine 是一款面向未来的智能化业务流程编排引擎，提供强大的低代码开发能力，支持 AI 赋能与自动化集成，帮助企业快速构建和优化业务流程。

ORION Engine is a next-generation intelligent business process orchestration engine that offers powerful low-code development capabilities, 
AI empowerment, and automation integration to help enterprises rapidly build and optimize business processes.

# 主要功能 | Key Features

## 📌 业务流程 | Business Process
- 支持 BPMN 2.0 规范，提供流程建模、执行与管理能力
- 可视化流程设计，拖拽式操作，降低使用门槛
- 灵活的流程审批、任务分配和动态表单支持

- Supports BPMN 2.0 standards, enabling process modeling, execution, and management
- Visual process design with drag-and-drop functionality for ease of use
- Flexible process approvals, task assignments, and dynamic form support

## 📌 决策管理 | Decision Management
- 内置决策引擎，支持 DMN 规则建模
- 业务规则与流程无缝结合，实现智能决策
- 可扩展的 AI 规则推理能力

- Built-in decision engine supporting DMN rule modeling
- Seamless integration of business rules with processes for intelligent decision-making
- Extensible AI rule inference capabilities

## 🎨 UI/UX 设计 | UI/UX Design
- 低代码可视化界面设计，支持表单、页面和仪表盘开发
- 组件化设计，提高前端开发效率
- 自适应布局，支持多终端访问

- Low-code visual interface design for forms, pages, and dashboards
- Component-based design for enhanced front-end development efficiency
- Responsive layout supporting multi-terminal access

## 🔍 业务流程监控管理 | Business Process Monitoring & Management
- 实时流程监控，支持 KPI 统计和分析
- 运行实例可视化，提升运维效率
- 任务管理与日志审计，保障流程合规

- Real-time process monitoring with KPI statistics and analysis
- Visualized running instances for improved operational efficiency
- Task management and log auditing to ensure compliance

## 🤖 AI 应用中心 | AI Application Hub
- 提供 AI 连接器，支持 LLM、机器学习模型的集成
- 智能助手 Copilot，支持自然语言理解和任务执行
- AI 赋能业务流程，提高自动化水平
- 任务待办处理，提高业务流程的执行效率

- AI connectors for seamless integration with LLMs and machine learning models
- Intelligent assistant Copilot for natural language understanding and task execution
- AI-powered business processes for enhanced automation
- Task management and to-do processing for improved execution efficiency

# How to build and launch

The application is maven-organized Spring Boot project. Therefore, it can be build with the following command:

```bash
./mvnw clean package
```

A executable package locating under the `target` dictionary after successful build can be used to launch the application with

```bash
java -jar engine-<version>.jar
```

The web page an be accessed via `http://localhost:8080` using web browsers with username `demo` and password `demo`.

# Configuration

The application is built with [`PropertiesLauncher` features](https://docs.spring.io/spring-boot/3.3/specification/executable-jar/property-launcher.html).
Therefore, external libraries and configuration properties can be used to config the application.

For example:

- using other databases
- change Spring Boot application configurations
- change Orion Automation Engine configurations

# Plugins

The following plugins are installed in the application.

1. [email incident notification](https://github.com/orion-automation/email-incident-notification) 
2. [external launcher](https://github.com/orion-automation/external-launcher)
3. [collaboration](https://github.com/orion-automation/collaboration)
4. [application](https://github.com/orion-automation/application)
5. [delegation](https://github.com/orion-automation/delegation)
6. [user setting](https://github.com/orion-automation/user-setting)
7. [process draft](https://github.com/orion-automation/process-draft)
8. [camunda connect](https://github.com/camunda/camunda-bpm-platform/tree/master/connect)
    - HTTP Connector
    - SOAP Connector
9. [camunda spin](https://github.com/camunda/camunda-bpm-platform/tree/master/spin)

# Script Engines

The following script engines are installed in the application.

1. Javascript

   Graalvm JS engine

2. Groovy

   Apache groovy engine

# Required System Environment

- Java JDK 17+

# 📜 许可 | License
ORION Engine 遵循 Apache 2.0 许可证，允许自由使用、修改和分发。

ORION Engine is licensed under the Apache 2.0 License, allowing free use, modification, and distribution.

📌 详细许可信息 | License Details: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

# 📂 贡献 | Contribution
欢迎开发者贡献代码，与我们一起完善 ORION Engine。
如您有任何问题或建议，请创建新的[工单](https://github.com/orion-automation/orion-engine/issues).

We welcome developers to contribute code and collaborate with us to improve ORION Engine.
If you have any questions or suggestions, please create a new [issue](https://github.com/orion-automation/orion-engine/issues).