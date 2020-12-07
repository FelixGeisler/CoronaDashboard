
# Use-Case-Diagram

```plantuml
left to right direction
skinparam packagestyle rectangle
actor User as U
Server as S

rectangle "Corona Dashboard" #azure {
    U -- (Show Table)
    (Show Table) <.. (Query DB): <<extend>>
    U -- (Show Diagrams)
    
    (Show Diagrams) <.. (Query DB): <<extend>>
    (Query DB) -- S
    U -- (Show API)
    (Show API) <.. (Query DB): <<extend>>

    S -- (Write to DB)
    (Write to DB) ..> (Query API): <<include>>
    (Query API) -- S
}
```

# Sequence-Diagram

```plantuml
box Client #azure
participant Client
end box

box Server #azure
participant WebServer
participant Database
end box

box APIs #azure
participant RKI_API
end box

Group #LightBlue Server-API Communication
WebServer -> RKI_API: GET
activate WebServer
activate Client
activate RKI_API
RKI_API --> WebServer: SEND
deactivate RKI_API
activate Database
WebServer -> Database: REPLACE INTO
end

Group #LightBlue Client-Server Communication
activate Client
Client -> WebServer: GET
WebServer -> Database: SELECT
Database --> WebServer: Data
deactivate Database 
WebServer --> Client: SEND
deactivate Client
deactivate WebServer
end
```
