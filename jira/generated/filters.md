# Filters 2023_3_29
## Across teams
| Description | Filter |
| --- | --- |
| Missing component | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND component is EMPTY )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20component%20is%20EMPTY%20)) |

## Bear
| Description | Filter |
| --- | --- |
| Needs triage | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Bear AND priority is EMPTY )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Bear%20AND%20priority%20is%20EMPTY%20)) |
| Needs triage (out of SLA) | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Bear AND priority is EMPTY AND not( created >= -2d ) )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Bear%20AND%20priority%20is%20EMPTY%20AND%20not(%20created%20%3E=%20-2d%20)%20)) |
| Needs resolution | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Bear AND not( priority is EMPTY ) )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Bear%20AND%20not(%20priority%20is%20EMPTY%20)%20)) |
| Needs resolution (out of SLA) | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Bear AND not( priority is EMPTY ) AND not( created >= -30d ) )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Bear%20AND%20not(%20priority%20is%20EMPTY%20)%20AND%20not(%20created%20%3E=%20-30d%20)%20)) |

## Lion
| Description | Filter |
| --- | --- |
| Needs triage | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Lion AND priority is EMPTY )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Lion%20AND%20priority%20is%20EMPTY%20)) |
| Needs triage (out of SLA) | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Lion AND priority is EMPTY AND not( created >= -2d ) )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Lion%20AND%20priority%20is%20EMPTY%20AND%20not(%20created%20%3E=%20-2d%20)%20)) |
| Needs resolution | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Lion AND not( priority is EMPTY ) )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Lion%20AND%20not(%20priority%20is%20EMPTY%20)%20)) |
| Needs resolution (out of SLA) | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Lion AND not( priority is EMPTY ) AND not( created >= -30d ) )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Lion%20AND%20not(%20priority%20is%20EMPTY%20)%20AND%20not(%20created%20%3E=%20-30d%20)%20)) |

## Tiger
| Description | Filter |
| --- | --- |
| Needs triage | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Tiger AND priority is EMPTY )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Tiger%20AND%20priority%20is%20EMPTY%20)) |
| Needs triage (out of SLA) | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Tiger AND priority is EMPTY AND not( created >= -2d ) )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Tiger%20AND%20priority%20is%20EMPTY%20AND%20not(%20created%20%3E=%20-2d%20)%20)) |
| Needs resolution | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Tiger AND not( priority is EMPTY ) )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Tiger%20AND%20not(%20priority%20is%20EMPTY%20)%20)) |
| Needs resolution (out of SLA) | [( project = APPL AND type = Bug AND not( statusCategory = Done ) AND labels = components:Tiger AND not( priority is EMPTY ) AND not( created >= -30d ) )](https://acuitymd.atlassian.net/issues/?jql=(%20project%20=%20APPL%20AND%20type%20=%20Bug%20AND%20not(%20statusCategory%20=%20Done%20)%20AND%20labels%20=%20components:Tiger%20AND%20not(%20priority%20is%20EMPTY%20)%20AND%20not(%20created%20%3E=%20-30d%20)%20)) |
