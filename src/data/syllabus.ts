/**
 * ACCA Audit and Assurance (AA) — Study Hub structure for exams Sept 2026 – June 2027.
 *
 * Compact text format, parsed once at load:
 *   C|<chapter number>|<chapter title>
 *   S|<section code>|<section title>
 *   <study hub slug>|<subtopic code and title>
 *
 * The slug is the part after `#read/section/` in the Study Hub URL. Slugs are copied verbatim
 * because the Study Hub is inconsistent (missing hyphens, `-1` suffixes), so they can't be derived.
 */
const RAW = `
C|1|Audit and Other Assurance Engagements
S|1.0|Whole chapter
chapter-1-visual-overview|1.0 Audit and Other Assurance Engagements

C|2|External Audit
S|2.1|Regulation
211-sources|2.1.1 Sources
212-mechanisms|2.1.2 Mechanisms
S|2.2|International Federation of Accountants (IFAC)
221-mission-vision-and-values|2.2.1 Mission, Vision and Values
222-standard-setting-board|2.2.2 Standard-setting Board
S|2.3|Standards Issued by IAASB
231-structure|2.3.1 Structure
232-scope-and-authority-of-isas|2.3.2 Scope and Authority of ISAs
233-development|2.3.3 Development
S|2.4|External Audit
241-statutory-regulation|2.4.1 Statutory Regulation
242-audit-exemption|2.4.2 Audit Exemption
243-eligibility-to-become-an-auditor|2.4.3 Eligibility to Become an Auditor
244-recognised-supervisory-bodies-rsbs|2.4.4 Recognised Supervisory Bodies (RSBs)
245-rights-and-duties-of-auditors|2.4.5 Rights and Duties of Auditors
246-appointment-of-auditors|2.4.6 Appointment of Auditors
247-removal-of-auditors|2.4.7 Removal of Auditors
248-limitations-of-external-audits|2.4.8 Limitations of External Audits
S|2.5|Quality Management Procedures
251-isa-220-revised-2020|2.5.1 ISA 220 (Revised 2020)
252-engagement-resources|2.5.2 Engagement Resources
253-engagement-performance|2.5.3 Engagement Performance
254-monitoring-quality|2.5.4 Monitoring Quality
255-compliance-with-ethical-requirements|2.5.5 Compliance with Ethical Requirements

C|3|Corporate Governance
S|3.1|Corporate Governance
311-terminology|3.1.1 Terminology
312-objective|3.1.2 Objective
313-relevance|3.1.3 Relevance
314-importance|3.1.4 Importance
S|3.2|OECD and UK Codes
321-oecd-overview|3.2.1 OECD Overview
322-oecd-principles|3.2.2 OECD Principles
323-uk-code-overview|3.2.3 UK Code Overview
324-uk-code-main-principles|3.2.4 UK Code Main Principles
325-corporate-governance-deficiencies|3.2.5 Corporate Governance Deficiencies
S|3.3|Audit Committees
331-introduction|3.3.1 Introduction
332-main-roles-and-responsibilities|3.3.2 Main Roles and Responsibilities
333-frc-guidance-on-audit-committees|3.3.3 FRC Guidance on Audit Committees
334-audit-committees-and-the-external-audit-minimum-standard|3.3.4 Audit Committees and the External Audit: Minimum Standard
335-benefits-and-limitations|3.3.5 Benefits and Limitations
336-risk-management-and-internal-control|3.3.6 Risk Management and Internal Control

C|4|Professional Codes of Ethics and Conduct
S|4.1|ACCA's Code of Ethics and Conduct
411-complying-with-the-code|4.1.1 Complying with the Code
412-fundamental-principles|4.1.2 Fundamental Principles
413-conceptual-framework-r1203-r1205|4.1.3 Conceptual Framework (R120.3-R120.5)
414-threats-r1206|4.1.4 Threats (R120.6)
415-addressing-threats-r12010|4.1.5 Addressing Threats (R120.10)
S|4.2|Independence Standards
421-independence-objectivity-and-integrity-4005|4.2.1 Independence, Objectivity and Integrity (400.5)
422-fees|4.2.2 Fees
423-inducements-including-gifts-and-hospitality-r4203|4.2.3 Inducements, Including Gifts and Hospitality (R420.3)
424-actual-or-threatened-litigation-430|4.2.4 Actual or Threatened Litigation (430)
425-financial-interests|4.2.5 Financial Interests
426-family-and-other-personal-relationships-r5215-r5218|4.2.6 Family and Other Personal Relationships (R521.5-R521.8)
427-loans-and-guarantees-r5114-r5117|4.2.7 Loans and Guarantees (R511.4-R511.7)
428-provision-of-non-assurance-services-to-assurance-clients|4.2.8 Provision of Non-assurance Services to Assurance Clients
429-long-association-of-senior-personnel-r5404-r54020|4.2.9 Long Association of Senior Personnel (R540.4-R540.20)
4210-employment-with-an-audit-client|4.2.10 Employment with an Audit Client
4211-close-business-relationships-r5204|4.2.11 Close Business Relationships (R520.4)
4212-recent-service-r5223|4.2.12 Recent Service (R522.3)
4213-serving-as-a-director-r5234|4.2.13 Serving as a Director (R523.4)
4214-breach-of-independence-provisions|4.2.14 Breach of Independence Provisions
S|4.3|Second Opinions
430-introduction|4.3.0 Introduction
431-threats-to-the-fundamental-principles-3213-a|4.3.1 Threats to the Fundamental Principles (321.3 A)
432-actions-to-address|4.3.2 Actions to Address
S|4.4|Confidentiality
440-introduction|4.4.0 Introduction
441-disclosure-of-confidential-information-r1142|4.4.1 Disclosure of Confidential Information (R114.2)
442-use-of-confidential-information-r1142|4.4.2 Use of Confidential Information (R114.2)
S|4.5|Conflicts of Interest
451-two-types-3102|4.5.1 Two Types (310.2)
452-professional-accountant-v-client|4.5.2 Professional Accountant v Client
453-client-v-client-r3105-r3109|4.5.3 Client v Client (R310.5, R310.9)

C|5|Auditor Appointment
S|5.1|Auditor Engagement
511-new-professional-work|5.1.1 New Professional Work
512-communication-with-the-existing-auditor|5.1.2 Communication with the Existing Auditor
513-relevant-matters-to-consider|5.1.3 Relevant Matters to Consider
514-unpaidoverdue-fees-to-existing-auditor|5.1.4 Unpaid/Overdue Fees to Existing Auditor
515-additional-professional-work|5.1.5 Additional Professional Work
S|5.2|Existing Auditor
521-response|5.2.1 Response
522-transfer-information|5.2.2 Transfer Information
523-review-of-working-papers|5.2.3 Review of Working Papers
S|5.3|Terms of Audit Engagements (ISA 210)
531-preconditions-for-an-audit|5.3.1 Preconditions for an Audit
532-engagement-letter|5.3.2 Engagement Letter
533-principal-contents|5.3.3 Principal Contents
534-recurring-audits|5.3.4 Recurring Audits
535-sample-engagement-letter|5.3.5 Sample Engagement Letter
536-basis-of-fees|5.3.6 Basis of Fees

C|6|Audit Documentation
S|6.1|ISA 230 Audit Documentation
611-definition-and-scope|6.1.1 Definition and Scope
612-purpose|6.1.2 Purpose
613-importance|6.1.3 Importance
614-objective-of-the-auditor|6.1.4 Objective of the Auditor
615-timely-preparation|6.1.5 Timely Preparation
S|6.2|Sufficient and Appropriate Record
621-extent|6.2.1 Extent
622-factors-to-consider|6.2.2 Factors to Consider
623-standardisation|6.2.3 Standardisation
624-documentation-techniques|6.2.4 Documentation Techniques
625-use-of-it|6.2.5 Use of IT
S|6.3|Content
631-permanent-v-current-audit-files|6.3.1 Permanent v Current Audit Files
632-audit-section-structure|6.3.2 Audit Section Structure
633-significant-matters|6.3.3 Significant Matters
634-assembly-of-working-papers-file|6.3.4 Assembly of Working Papers File
S|6.4|Confidentiality, Safe Custody, Retention and Ownership
641-confidentiality-and-safe-custody|6.4.1 Confidentiality and Safe Custody
642-retention|6.4.2 Retention
643-ownership|6.4.3 Ownership

C|7|Audit Planning
S|7.1|Overall Objectives (ISA 200)
711-overall-objectives-of-the-auditor|7.1.1 Overall Objectives of the Auditor
712-audit-conducted-in-accordance-with-isas|7.1.2 Audit Conducted in Accordance with ISAs
S|7.2|Planning
721-objective|7.2.1 Objective
722-benefits-of-adequate-planning|7.2.2 Benefits of Adequate Planning
723-scope|7.2.3 Scope
724-planning-cycle|7.2.4 Planning Cycle
725-planning-activities|7.2.5 Planning Activities
S|7.3|Preliminary Engagement Activities
731-need-for-preliminary-engagement-activities|7.3.1 Need For Preliminary Engagement Activities
732-basic-approach-to-preliminary-engagement-activities|7.3.2 Basic Approach to Preliminary Engagement Activities
S|7.4|The Audit Strategy
741-establishing-the-overall-audit-strategy|7.4.1 Establishing the Overall Audit Strategy
742-nature-timing-and-extent-of-resources|7.4.2 Nature, Timing and Extent of Resources
743-timetable|7.4.3 Timetable
S|7.5|Audit Plan
750-introduction|7.5.0 Introduction
751-rationale|7.5.1 Rationale
752-content|7.5.2 Content
753-changes-to-planning-decisions|7.5.3 Changes to Planning Decisions
S|7.6|Direction, Supervision and Review
760introduction|7.6.0 Introduction
761-direction|7.6.1 Direction
762supervision|7.6.2 Supervision
763-review|7.6.3 Review
S|7.7|Documentation
770introduction|7.7.0 Introduction
771audit-strategy|7.7.1 Audit Strategy
772audit-plan|7.7.2 Audit Plan
773changes-to-the-audit-strategy-and-audit-plan|7.7.3 Changes to the Audit Strategy and Audit Plan

C|8|Identifying and Assessing Risk
S|8.1|Identifying and Assessing Risk
810introduction|8.1.0 Introduction
811-steps|8.1.1 Steps
812-obtaining-an-initial-understanding|8.1.2 Obtaining an Initial Understanding
813-audit-team-discussions|8.1.3 Audit Team Discussions
814-sources-of-information|8.1.4 Sources of Information
815-using-the-information|8.1.5 Using the Information
S|8.2|New and Continuing Audits
821-matters-to-consider|8.2.1 Matters to Consider
822-information-needs|8.2.2 Information Needs
823selection-and-application-of-accounting-policies|8.2.3 Selection and Application of Accounting Policies
824-updating-existing-clients|8.2.4 Updating Existing Clients
S|8.3|Audit Risk
831-concept|8.3.1 Concept
832risks-of-material-misstatement|8.3.2 Risks of Material Misstatement
833-audit-risk-model|8.3.3 Audit Risk Model
834inherent-risk-isa-315|8.3.4 Inherent Risk (ISA 315)
835control-risk-isa-315|8.3.5 Control Risk (ISA 315)
836detection-risk-isa-200|8.3.6 Detection Risk (ISA 200)
837-application-of-audit-risk-model|8.3.7 Application of Audit Risk Model
838-matters-requiring-documentation|8.3.8 Matters Requiring Documentation

C|9|Systems of Internal Control
S|9.1|Internal Control
911-obtaining-an-understanding|9.1.1 Obtaining an Understanding
912-control-environment|9.1.2 Control Environment
913-entitys-risk-assessment-process|9.1.3 Entity's Risk Assessment Process
914-information-system-and-communication|9.1.4 Information System and Communication
915-control-activities|9.1.5 Control Activities
916-monitoring-process|9.1.6 Monitoring Process
917-limitations-of-internal-control|9.1.7 Limitations of Internal Control
S|9.2|Use and Evaluation
921-control-environment-risk-assessment-and-monitoring-process|9.2.1 Control Environment, Risk Assessment and Monitoring Process
922-control-activities|9.2.2 Control Activities
923-evaluation-methods|9.2.3 Evaluation Methods
924-impact-on-audit-approach|9.2.4 Impact on Audit Approach
925-reporting-deficiencies|9.2.5 Reporting Deficiencies

C|10|Audit Materiality
S|10.1|Materiality
1011-concept|10.1.1 Concept
1012-basic-principles|10.1.2 Basic Principles
1013-levels-of-materiality|10.1.3 Levels of Materiality
1014-performance-materiality|10.1.4 Performance Materiality
1015-qualitative-materiality|10.1.5 Qualitative Materiality
1016-relevance-to-the-audit|10.1.6 Relevance to the Audit
S|10.2|Considerations
1021-professional-judgement|10.2.1 Professional Judgement
1022-amount-quantitative-materiality|10.2.2 Amount (Quantitative Materiality)
1023-nature-qualitative-materiality|10.2.3 Nature (Qualitative Materiality)
S|10.3|Audit Procedures
1031-in-planning|10.3.1 In Planning
1032-effect-on-audit-work|10.3.2 Effect on Audit Work
1033-relationship-with-audit-risk|10.3.3 Relationship with Audit Risk
1034-revising-materiality-as-the-audit-progresses|10.3.4 Revising Materiality as the Audit Progresses
1035-documentation|10.3.5 Documentation

C|11|Fraud, Law and Regulations
S|11.1|Fraud
1110-objectives|11.1.0 Objectives
1111definitions|11.1.1 Definitions
1112-types-of-intentional-misstatement|11.1.2 Types of Intentional Misstatement
1113-management-and-auditors-responsibilities|11.1.3 Management and Auditor's Responsibilities
1114-professional-scepticism|11.1.4 Professional Scepticism
1115-risk-assessment-procedures-and-related-activities-1|11.1.5 Risk Assessment Procedures and Related Activities
1116-evaluation-of-fraud-risk-factors|11.1.6 Evaluation of Fraud Risk Factors
1117-effect-on-audit-strategy-and-extent-of-work|11.1.7 Effect on Audit Strategy and Extent of Work
1118-written-representations|11.1.8 Written Representations
1119-communication-with-management-and-tcwg|11.1.9 Communication with Management and TCWG
11110-resignation-from-the-engagement|11.1.10 Resignation from the Engagement
S|11.2|Laws and Regulations
1120-introduction|11.2.0 Introduction
1121-definition|11.2.1 Definition
1122-types-of-laws-and-regulations|11.2.2 Types of Laws and Regulations
1123management-and-auditors-responsibilities|11.2.3 Management and Auditor's Responsibilities
1124-indications-of-non-compliance|11.2.4 Indications of Non-compliance
1125non-compliance-discovered|11.2.5 Non-compliance Discovered
1126reporting-non-compliance-and-withdrawal-from-the-engagement|11.2.6 Reporting Non-compliance and Withdrawal from the Engagement

C|12|Tests of Control
S|12.1|Computer System Controls
1211-general-it-controls|12.1.1 General IT Controls
1212-information-processing-controls|12.1.2 Information Processing Controls
S|12.2|Tests of Controls
1221-further-audit-procedures|12.2.1 Further Audit Procedures
1222-operating-effectiveness|12.2.2 Operating Effectiveness
1223-nature-timing-and-extent-of-tests-of-control|12.2.3 Nature, Timing and Extent of Tests of Control
1224-results-of-tests-of-control|12.2.4 Results of Tests of Control
1225-reliance-on-past-results|12.2.5 Reliance on Past Results
S|12.3|Exam Skills for Tests of Control
1231-key-skills|12.3.1 Key Skills
1232-transaction-cycles|12.3.2 Transaction Cycles
S|12.4|Revenue Cycle
1241-control-objectives|12.4.1 Control Objectives
1242-internal-control-examples-and-sample-tests-of-controls|12.4.2 Internal Control Examples and Sample Tests of Controls
S|12.5|Purchases Cycle
1251-control-objectives|12.5.1 Control Objectives
1252-internal-control-examples-and-tests-of-controls|12.5.2 Internal Control Examples and Tests of Controls
S|12.6|Payroll Cycle
1261-control-objectives|12.6.1 Control Objectives
1262-internal-control-examples-and-tests-of-controls|12.6.2 Internal Control Examples and Tests of Controls
S|12.7|Inventory Cycle
1271-control-objectives|12.7.1 Control Objectives
1272-internal-control-examples-and-tests-of-control|12.7.2 Internal Control Examples and Tests of Control
S|12.8|Bank and Cash Cycle
1281-control-objectives|12.8.1 Control Objectives
1282-internal-control-examples-and-tests-of-control|12.8.2 Internal Control Examples and Tests of Control
S|12.9|Non-current Assets Cycle
1291-control-objectives|12.9.1 Control Objectives
1292-internal-control-examples-and-sample-tests-of-controls|12.9.2 Internal Control Examples and Sample Tests of Controls

C|13|Communication on Internal Control
S|13.1|Communication with Those Charged with Governance
1310-isa-260|13.1.0 ISA 260
1311-responsibilities|13.1.1 Responsibilities
1312-form-timing-and-general-content-of-the-audit|13.1.2 Form, Timing and General Content of the Audit
1313-communication-of-significant-findings-from-the-audit|13.1.3 Communication of Significant Findings from the Audit
1314-auditor-independence|13.1.4 Auditor Independence
1315-two-way-communication|13.1.5 Two-way Communication
S|13.2|Deficiencies in Internal Control
1321deficiencies|13.2.1 Deficiencies
1322-significant-deficiencies|13.2.2 Significant Deficiencies
S|13.3|Communicating Deficiencies
1331-requirement-to-report|13.3.1 Requirement to Report
1332-report-to-management|13.3.2 Report to Management
1333-content|13.3.3 Content
1334-form-and-presentation-of-supporting-detail|13.3.4 Form and Presentation of Supporting Detail
1335-follow-up|13.3.5 Follow-up
1336-interested-third-parties|13.3.6 Interested Third Parties

C|14|Internal Audit
S|14.1|Corporate Governance
1411-internal-audit|14.1.1 Internal Audit
1412-assessing-the-need-for-internal-audit|14.1.2 Assessing the Need for Internal Audit
1413-relationship-between-external-and-internal-auditors|14.1.3 Relationship Between External and Internal Auditors
S|14.2|Internal Audit Function
1421-role-in-corporate-governance|14.2.1 Role in Corporate Governance
1422-scope-of-function|14.2.2 Scope of Function
1423-limitations|14.2.3 Limitations
1424-structure-of-function|14.2.4 Structure of Function
S|14.3|Outsourcing
1431-meaning|14.3.1 Meaning
1432-internal-audit|14.3.2 Internal Audit
1433-factors-to-consider|14.3.3 Factors to Consider
1434-benefits|14.3.4 Benefits
1435-disadvantages-to-the-company|14.3.5 Disadvantages to the Company
1436-service-provider-issues|14.3.6 Service Provider Issues
S|14.4|Other Assignments
1440-introduction|14.4.0 Introduction
1441-value-for-moneyvfm|14.4.1 Value for Money (VFM)
1442-best-value|14.4.2 Best Value
1443-it-audit|14.4.3 IT Audit
1444-financial-processes-audit|14.4.4 Financial Processes Audit
1445-regulatory-compliance|14.4.5 Regulatory Compliance
1446-fraud-investigations|14.4.6 Fraud Investigations
1447-customer-experience|14.4.7 Customer Experience
1448-operational-audit-process-based-audit|14.4.8 Operational Audit ("Process-Based" Audit)
S|14.5|Internal Audit Reports
1451-primary-purposes|14.5.1 Primary Purposes
1452-reporting-arrangements|14.5.2 Reporting Arrangements
1453-structure-of-the-report|14.5.3 Structure of the Report
1454-sample-internal-audit-report|14.5.4 Sample Internal Audit Report

C|15|Audit Evidence
S|15.1|Audit Evidence (ISA 500)
1511-basic-principles|15.1.1 Basic Principles
1512-sources|15.1.2 Sources
S|15.2|Sufficient
1521-factors-to-consider|15.2.1 Factors to Consider
1522-interrelationship-with-appropriateness|15.2.2 Interrelationship with Appropriateness
S|15.3|Appropriate
1531-two-aspects|15.3.1 Two Aspects
1532-relevance|15.3.2 Relevance
1533-reliability|15.3.3 Reliability
1534-audit-objectives|15.3.4 Audit Objectives
S|15.4|Obtaining Audit Evidence
1541-where-evidence-is-obtained-from|15.4.1 Where Evidence Is Obtained From
1542-procedures-for-gathering-evidence|15.4.2 Procedures for Gathering Evidence
1543-examination-skills|15.4.3 Examination Skills
S|15.5|Substantive Procedures
1551-aim|15.5.1 Aim
1552-nature-timing-and-extent|15.5.2 Nature, Timing and Extent
1553-hybrid-approach|15.5.3 Hybrid Approach

C|16|Analytical Procedures
S|16.1|Meaning and Nature
1611-meaning|16.1.1 Meaning
1612-purposes|16.1.2 Purposes
1613-consideration-of-relationships|16.1.3 Consideration of Relationships
1614-comparisons-of-financial-information|16.1.4 Comparisons of Financial Information
1615-expectations|16.1.5 Expectations
S|16.2|In Planning
1621-need-for|16.2.1 Need For
1622-typical-approach|16.2.2 Typical Approach
1623-ratio-analysis|16.2.3 Ratio Analysis
S|16.3|Substantive Analytical Procedures
1631-approach|16.3.1 Approach
1632-suitability|16.3.2 Suitability
1633-reliability-of-data|16.3.3 Reliability of Data
1634-precision|16.3.4 Precision
1635-differences-identified|16.3.5 Differences Identified
S|16.4|Overall Conclusion
1641-near-the-end-of-the-audit|16.4.1 Near the End of the Audit
S|16.5|Investigating Results
1651-fluctuations-or-inconsistent-relationships|16.5.1 Fluctuations or Inconsistent Relationships

C|17|Accounting Estimates
S|17.1|Auditing Accounting Estimates
1711-definitions|17.1.1 Definitions
1712-nature|17.1.2 Nature
1713-determination|17.1.3 Determination
S|17.2|Audit Procedures
1721-planning|17.2.1 Planning
1722-estimation-uncertainty|17.2.2 Estimation Uncertainty
1723-response-to-assessed-risk|17.2.3 Response to Assessed Risk

C|18|The Work of Others
S|18.1|Experts
1810-introduction|18.1.0 Introduction
1811-managements-expert-isa-500|18.1.1 Management's Expert (ISA 500)
1812-auditors-expert-isa-620|18.1.2 Auditor's Expert (ISA 620)
1813-reporting|18.1.3 Reporting
S|18.2|Internal Audit
1820-introduction|18.2.0 Introduction
1821-activities|18.2.1 Activities
1822-basic-principles|18.2.2 Basic Principles
1823-whether-to-use|18.2.3 Whether to Use
1824-using-the-work|18.2.4 Using the Work
1825-direct-assistance|18.2.5 Direct Assistance
S|18.3|Service Organisations
1830-introduction|18.3.0 Introduction
1831-use-by-client|18.3.1 Use by Client
1832-basic-principles|18.3.2 Basic Principles
1833-obtaining-an-understanding|18.3.3 Obtaining an Understanding
1834-assessing-risk|18.3.4 Assessing Risk
1835-responding-to-assessed-risks|18.3.5 Responding to Assessed Risks
1836-assurance-reports|18.3.6 Assurance Reports
1837-auditors-report-on-the-financial-statements|18.3.7 Auditor's Report on the Financial Statements

C|19|Audit Sampling
S|19.1|Obtaining Audit Evidence
1911-basic-principles|19.1.1 Basic Principles
1912-terminology|19.1.2 Terminology
S|19.2|Audit Sampling
1921-stages|19.2.1 Stages
1922-sample-design|19.2.2 Sample Design
1923-sample-size|19.2.3 Sample Size
1924-selection-methods|19.2.4 Selection Methods
1925-testing-the-sample|19.2.5 Testing the Sample
1926-results|19.2.6 Results
1927-projecting-misstatements|19.2.7 Projecting Misstatements
1928-evaluation-of-results|19.2.8 Evaluation of Results
S|19.3|Statistical v Non-statistical Sampling
1931-statistical-sampling|19.3.1 Statistical Sampling
1932-non-statistical-sampling|19.3.2 Non-statistical Sampling

C|20|Written Representations
S|20.1|Purpose and Procedure
2011-purpose|20.1.1 Purpose
2012-procedure-for-obtaining|20.1.2 Procedure for Obtaining
S|20.2|Audit Evidence
2021-essential-representations|20.2.1 Essential Representations
2022-other-representations|20.2.2 Other Representations
2023-specific-instances|20.2.3 Specific Instances
S|20.3|Other Considerations
2031-reliability-of-representations|20.3.1 Reliability of Representations
2032-managements-responsibilities|20.3.2 Management's Responsibilities
2033-refusal-by-management-to-provide-representations|20.3.3 Refusal by Management to Provide Representations
S|20.4|Representation Letter
2041-illustrative-letter|20.4.1 Illustrative Letter

C|21|Automated Tools and Techniques
S|21.1|Audit Approaches
2111-auditing-around-v-through-the-computer|21.1.1 Auditing around v through the Computer
2112-small-computer-installations|21.1.2 Small Computer Installations
S|21.2|Automated Tools and Techniques
2121-use-in-an-audit|21.2.1 Use in an Audit
2122-considerations-affecting-use|21.2.2 Considerations Affecting Use
2123-general-advantages|21.2.3 General Advantages
2124-general-difficulties|21.2.4 General Difficulties
S|21.3|Test Data
2131-description|21.3.1 Description
2132-process|21.3.2 Process
2133-precautions|21.3.3 Precautions
2134-advantages-and-disadvantages|21.3.4 Advantages and Disadvantages
S|21.4|Audit Software
2141-description|21.4.1 Description
2142-off-the-shelf|21.4.2 Off-the-Shelf
2143-bespoke|21.4.3 Bespoke
2144-embedded|21.4.4 Embedded
2145-uses|21.4.5 Uses
2146-precautions|21.4.6 Precautions
S|21.5|Big Data and Data Analytics
2151-big-data|21.5.1 Big Data
2152-data-analytics|21.5.2 Data Analytics
2153-audit-applications|21.5.3 Audit Applications
2154-benefits|21.5.4 Benefits
S|21.6|Emerging Technologies
2161-benefits-and-challenges|21.6.1 Benefits and Challenges
2162-generative-artificial-intelligence-genai|21.6.2 Generative Artificial Intelligence (GenAI)
2163-robotic-process-automation-rpa-tools|21.6.3 Robotic Process Automation (RPA) Tools
2164-drones|21.6.4 Drones

C|22|Non-current Assets
S|22.1|Tangible Non-current Assets
2210-introduction|22.1.0 Introduction
2211-general-risks|22.1.1 General Risks
2212-assertions|22.1.2 Assertions
2213-sources-of-evidence|22.1.3 Sources of Evidence
2214-audit-procedures|22.1.4 Audit Procedures
S|22.2|Intangible Non-current Assets
2220-introduction|22.2.0 Introduction
2221-audit-risks|22.2.1 Audit Risks
2222-assertions|22.2.2 Assertions
2223-substantive-procedures|22.2.3 Substantive Procedures
2224-research-and-development-costs-ias-38-intangible-assets|22.2.4 Research and Development Costs (IAS 38)

C|23|Inventory
S|23.1|Inventory
2311-types-of-inventory|23.1.1 Types of Inventory
2312-materiality|23.1.2 Materiality
2313-high-inherent-risk|23.1.3 High Inherent Risk
S|23.2|Risks and Assertions
2321-audit-risks|23.2.1 Audit Risks
2322-assertions|23.2.2 Assertions
2323-sources-of-evidence|23.2.3 Sources of Evidence
S|23.3|Attendance at Physical Inventory Count (ISA 501)
2331-existence-and-condition|23.3.1 Existence and Condition
2332-objectives|23.3.2 Objectives
2333-full-physical-count-1|23.3.3 Full Physical Count
2334-perpetual-continuous-count-inventory-system|23.3.4 Perpetual (Continuous Count) Inventory System
2335-procedures|23.3.5 Procedures
2336-inventory-held-by-third-parties|23.3.6 Inventory Held by Third Parties
S|23.4|Cut-off
2341-importance|23.4.1 Importance
2342-relationships|23.4.2 Relationships
2343-audit-procedures|23.4.3 Audit Procedures
S|23.5|Valuation
2351-ias-2|23.5.1 IAS 2
2352-cost-measurement-methods-and-formula|23.5.2 Cost Measurement Methods and Formula
2353-net-realisable-value-nrv|23.5.3 Net Realisable Value (NRV)
2354-allowances|23.5.4 Allowances
2355related-disclosures|23.5.5 Related Disclosures

C|24|External Confirmations, Receivables and Sales
S|24.1|External Confirmations (ISA 505)
2411-direct-written-response|24.1.1 Direct Written Response
2412-considerations|24.1.2 Considerations
2413-design-of-request|24.1.3 Design of Request
2414-confirmation-procedures|24.1.4 Confirmation Procedures
2415-responses|24.1.5 Responses
S|24.2|Risks and Procedures
2421-audit-risks|24.2.1 Audit Risks
2422audit-procedures|24.2.2 Audit Procedures
2423-sources-of-evidence|24.2.3 Sources of Evidence
S|24.3|Direct Confirmation of Accounts Receivable
2431-existence-assertion|24.3.1 Existence Assertion
2432-confirmation-sample-selection|24.3.2 Confirmation Sample Selection
2433-confirmation-requests|24.3.3 Confirmation Requests
2434-confirmation-returns|24.3.4 Confirmation Returns
2435-reconciling-confirmation-differences|24.3.5 Reconciling Confirmation Differences
2436-alternative-procedures|24.3.6 Alternative Procedures
S|24.4|Other Evidence
2441-completeness-and-accuracy|24.4.1 Completeness and Accuracy
2442-recoverability-valuation|24.4.2 Recoverability ("Valuation")

C|25|Share Capital, Reserves and Directors' Remuneration
S|25.1|Audit Risks
2511-general|25.1.1 General
2512-assertions|25.1.2 Assertions
S|25.2|Share Capital
2520-introduction|25.2.0 Introduction
2521-general|25.2.1 General
2522-ordinary-shares|25.2.2 Ordinary Shares
2523-preference-shares|25.2.3 Preference Shares
2524-presentation-and-disclosures|25.2.4 Presentation and Disclosures
S|25.3|Reserves
2531-types|25.3.1 Types
2532-audit-procedures|25.3.2 Audit Procedures
2533-statement-of-changes-in-equity-socie|25.3.3 Statement of Changes in Equity (SOCIE)
2534-dividends|25.3.4 Dividends
2535-disclosures|25.3.5 Disclosures
S|25.4|Directors' Remuneration
2541-general|25.4.1 General
2542-regulation|25.4.2 Regulation
2543-audit-procedures-1|25.4.3 Audit Procedures
S|25.5|Statutory Books and Records
2551-contents|25.5.1 Contents
2552-audit-evidence|25.5.2 Audit Evidence
2553audit-procedures|25.5.3 Audit Procedures

C|26|Bank and Cash
S|26.1|Risks
2611-audit-risks|26.1.1 Audit Risks
2612account-balances|26.1.2 Account Balances
2613-transactions|26.1.3 Transactions
2614sources-of-evidence|26.1.4 Sources of Evidence
S|26.2|Audit Procedures
2621-bank-loans|26.2.1 Bank Loans
2622bank-reconciliation|26.2.2 Bank Reconciliation
2623-petty-cash|26.2.3 Petty Cash
S|26.3|Bank Confirmation Report
2631-external-confirmation|26.3.1 External Confirmation
2632-format|26.3.2 Format
2633-planning-considerations|26.3.3 Planning Considerations

C|27|Liabilities, Provisions and Contingencies
S|27.1|Accounting for Liabilities, Provisions and Contingencies
2711-terminology|27.1.1 Terminology
2712-accounting-for-liabilities|27.1.2 Accounting for Liabilities
2713-non-current-liabilities|27.1.3 Non-current Liabilities
2714-provisions-and-contingencies|27.1.4 Provisions and Contingencies
S|27.2|Risks
2721-trade-payables-and-accrued-expenses|27.2.1 Trade Payables and Accrued Expenses
2722-provisions|27.2.2 Provisions
2723-assertions|27.2.3 Assertions
2724-sources-of-evidence|27.2.4 Sources of Evidence
S|27.3|Audit Procedures
2731-external-confirmation|27.3.1 External Confirmation
2732-unrecorded-liabilities|27.3.2 Unrecorded Liabilities
2733-accruals|27.3.3 Accruals
2734-provisions-and-contingencies|27.3.4 Provisions and Contingencies

C|28|Small Business and Not-for-Profit Organisations
S|28.1|Characteristics
2811-smaller-entities|28.1.1 Smaller Entities
2812-limited-segregation-of-duties|28.1.2 Limited Segregation of Duties
2813-domination-by-senior-management-or-owner|28.1.3 Domination by Senior Management or Owner
S|28.2|Engagement
2821-considerations|28.2.1 Considerations
2822-engagement-letter|28.2.2 Engagement Letter
S|28.3|Audit Approach
2831-risk-assessment|28.3.1 Risk Assessment
2832-limited-formal-internal-controls|28.3.2 Limited Formal Internal Controls
2833-accountancy-work|28.3.3 Accountancy Work
2834-auditing-for-completeness|28.3.4 Auditing for Completeness
2835-choosing-procedures|28.3.5 Choosing Procedures
2836-written-representations|28.3.6 Written Representations
S|28.4|Not-for-Profit Organisations
2840-introduction|28.4.0 Introduction
2841-types-of-nfp-organisation|28.4.1 Types of NFP Organisation
2842-audit-techniques|28.4.2 Audit Techniques

C|29|Audit Finalisation
S|29.1|Audit Completion Review
2910introduction|29.1.0 Introduction
2911overall-review-of-financial-statements|29.1.1 Overall Review of Financial Statements
2912types-of-review|29.1.2 Types of Review
2913-documentation|29.1.3 Documentation
2914completion-checklists|29.1.4 Completion Checklists
2915analytical-procedures|29.1.5 Analytical Procedures
2916other-tools|29.1.6 Other Tools
S|29.2|Uncorrected Misstatements
2921misstatements|29.2.1 Misstatements
2922essential-procedures|29.2.2 Essential Procedures
2923evaluating-misstatements|29.2.3 Evaluating Misstatements
S|29.3|Other Information
2930introduction|29.3.0 Introduction
2931procedures|29.3.1 Procedures
2932reporting|29.3.2 Reporting
S|29.4|Subsequent Events (ISA 560)
2941-purpose-of-a-review|29.4.1 Purpose of a Review
2942events-after-the-reporting-period|29.4.2 Events after the Reporting Period
2943audit-procedures-and-impact-on-report|29.4.3 Audit Procedures and Impact on Report

C|30|The Independent Auditor's Report
S|30.1|Basic Principles
3011forming-and-expressing-an-opinion|30.1.1 Forming and Expressing an Opinion
3012content-elements-isa-700|30.1.2 Content Elements (ISA 700)
3013modified-opinion|30.1.3 Modified Opinion
S|30.2|Key Audit Matters
3021-isa-701|30.2.1 ISA 701
3022-purpose|30.2.2 Purpose
3023-determining-and-communicating|30.2.3 Determining and Communicating
S|30.3|Unmodified Opinions
3031circumstance|30.3.1 Circumstance
3032sample-auditors-report|30.3.2 Sample Auditor's Report
S|30.4|Emphasis of Matter and Other Matter Paragraphs
3041distinction|30.4.1 Distinction
3042placement|30.4.2 Placement
3043circumstances-when-used|30.4.3 Circumstances When Used
S|30.5|Modified Opinions
3050isa-705|30.5.0 ISA 705
3051circumstances|30.5.1 Circumstances
3052basis-for-modified-opinion|30.5.2 Basis for Modified Opinion
3053standard-forms|30.5.3 Standard Forms
3054summary|30.5.4 Summary
3055-sample-opinions|30.5.5 Sample Opinions

C|31|Going Concern
S|31.1|Responsibilities
3111-going-concern-basis-of-accounting|31.1.1 Going Concern Basis of Accounting
3112managements-responsibility|31.1.2 Management's Responsibility
3113auditors-responsibilities-isa-570|31.1.3 Auditor's Responsibilities (ISA 570)
S|31.2|Planning
3121-risk-assessment|31.2.1 Risk Assessment
3122-indicators-of-significant-doubt|31.2.2 Indicators of Significant Doubt
3123mitigating-factors|31.2.3 Mitigating Factors
S|31.3|Audit Evidence
3130-introduction|31.3.0 Introduction
3131sources-of-information|31.3.1 Sources of Information
3132-review-procedures|31.3.2 Review Procedures
3133cash-flows|31.3.3 Cash Flows
3134-beyond-the-assessment-period|31.3.4 Beyond the Assessment Period
S|31.4|Conclusions and Reporting
3141-conclusion|31.4.1 Conclusion
3142-implications-for-the-auditors-report-1|31.4.2 Implications for the Auditor's Report
3143-communication-with-those-charged-with-governance|31.4.3 Communication with Those Charged With Governance
3144-reporting-to-an-appropriate-authority|31.4.4 Reporting to an Appropriate Authority
3145-illustrations|31.4.5 Illustrations
`;

export const STUDY_HUB_BASE =
  'https://studymaterials.accaglobal.com/app/for-exams-from-september-2026-to-june-2027-aa-audit-and-assurance';

export const hubUrl = (slug: string) => `${STUDY_HUB_BASE}#read/section/${slug}`;

/** Chapters whose "Technical Articles" page also has an explainer video (different slug). */
const ARTICLE_VIDEO = new Set([3, 8, 9, 14, 15, 16, 21]);

export interface Subtopic {
  id: string; // Study Hub slug — stable, unique
  code: string; // "2.4.3"
  title: string;
  sectionId: string;
  chapter: number;
}

export interface Section {
  id: string; // "2.4"
  title: string;
  chapter: number;
  subtopics: Subtopic[];
}

export interface Resource {
  label: string;
  url: string;
}

export interface Chapter {
  number: number;
  title: string;
  sections: Section[];
  resources: Resource[];
}

function chapterResources(n: number): Resource[] {
  if (n === 1) return [];
  const articles =
    n === 30 ? '30-technical-articles-1' : ARTICLE_VIDEO.has(n) ? `${n}-technical-articles-and-topic-explainer-video` : `${n}-technical-articles`;
  return [
    { label: 'Visual overview', url: hubUrl(`chapter-${n}-visual-overview`) },
    { label: 'Summary & quiz', url: hubUrl(`${n}-summary-and-quiz`) },
    { label: 'Syllabus coverage', url: hubUrl(`${n}-syllabus-coverage`) },
    { label: ARTICLE_VIDEO.has(n) ? 'Technical articles & video' : 'Technical articles', url: hubUrl(articles) },
  ];
}

function parse(): Chapter[] {
  const chapters: Chapter[] = [];
  let ch: Chapter | null = null;
  let sec: Section | null = null;
  for (const raw of RAW.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const parts = line.split('|');
    if (parts[0] === 'C') {
      ch = { number: Number(parts[1]), title: parts[2], sections: [], resources: chapterResources(Number(parts[1])) };
      chapters.push(ch);
    } else if (parts[0] === 'S') {
      sec = { id: parts[1], title: parts[2], chapter: ch!.number, subtopics: [] };
      ch!.sections.push(sec);
    } else {
      const [slug, label] = parts;
      const sp = label.indexOf(' ');
      sec!.subtopics.push({ id: slug, code: label.slice(0, sp), title: label.slice(sp + 1), sectionId: sec!.id, chapter: ch!.number });
    }
  }
  return chapters;
}

export const CHAPTERS: Chapter[] = parse();
export const SECTIONS: Section[] = CHAPTERS.flatMap((c) => c.sections);
export const SUBTOPICS: Subtopic[] = SECTIONS.flatMap((s) => s.subtopics);

export const CHAPTER_BY_NUMBER = new Map(CHAPTERS.map((c) => [c.number, c]));
export const SECTION_BY_ID = new Map(SECTIONS.map((s) => [s.id, s]));
export const SUBTOPIC_BY_ID = new Map(SUBTOPICS.map((s) => [s.id, s]));
