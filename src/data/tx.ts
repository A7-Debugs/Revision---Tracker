/**
 * ACCA Taxation (TX-UK) — Study Hub structure for exams June 2026 – June 2027. Same format as ./aa.ts, plus:
 *   V|<label>|<slug>   a topic explainer video, listed as a chapter resource rather than a subtopic to learn.
 *
 * Chapter 1's subtopics weren't supplied, so it's tracked as one item linked to its visual overview.
 */
export const TX_RAW = `
C|1|The UK Tax System
S|1.0|Whole chapter
chapter-1-visual-overview|1.0 The UK Tax System

C|2|Income Tax Computations
S|2.1|Income Tax Computation
211-introduction|2.1.1 Introduction
212-pro-forma-income-tax-computation|2.1.2 Pro-Forma Income Tax Computation
S|2.2|Income
221-non-savings-income|2.2.1 Non-Savings Income
222-savings-and-dividend-income|2.2.2 Savings and Dividend Income
223exempt-income|2.2.3 Exempt Income
224income-of-married-couples-and-persons-in-a-civil-partnership|2.2.4 Income of Married Couples and Persons in a Civil Partnership
S|2.3|Personal Allowance
231-basic-rules|2.3.1 Basic Rules
232-reduction-of-the-personal-allowance|2.3.2 Reduction of the Personal Allowance
S|2.4|Calculation of Income Tax Payable
241tax-rates-and-the-composition-of-taxable-income|2.4.1 Tax Rates and the Composition of Taxable Income
242-taxation-of-savings-income|2.4.2 Taxation of Savings Income
243-special-case-0-rate-on-savings-income|2.4.3 Special Case – 0% Rate on Savings Income
244-taxation-of-dividend-income|2.4.4 Taxation of Dividend Income
S|2.5|Deductions From Total Income
251-summary|2.5.1 Summary
252qualifying-loan-interest|2.5.2 Qualifying Loan Interest
S|2.6|Donations to Charities
261payroll-giving|2.6.1 Payroll Giving
262donations-under-the-gift-aid-scheme|2.6.2 Donations Under the Gift Aid Scheme
263-extended-basic-and-higher-rate-relief|2.6.3 Extended Basic and Higher Rate Relief
S|2.7|Pensions
271types-of-pension|2.7.1 Types of Pension
272-relief-for-contributions-paid-into-occupational-pension-schemes|2.7.2 Relief for Contributions Paid Into Occupational Pension Schemes
273relief-for-contributions-paid-into-personal-pension-schemes|2.7.3 Relief for Contributions Paid Into Personal Pension Schemes
274people-with-relevant-earnings-not-exceeding-3600|2.7.4 People With Relevant Earnings Not Exceeding £3,600
275annual-allowance|2.7.5 Annual Allowance
276tapered-annual-allowance|2.7.6 Tapered Annual Allowance
277annual-allowance-charge|2.7.7 Annual Allowance Charge
278-lifetime-allowance|2.7.8 Lifetime Allowance
V|Video: Pension contributions|279-topic-explainer-video-pension-contributions
S|2.8|Married Couples and Family
281utilisation-of-personal-allowances-and-basic-rate-bands|2.8.1 Utilisation of Personal Allowances and Basic Rate Bands
282transferable-amount-of-personal-allowance|2.8.2 Transferable Amount of Personal Allowance
283gifts-to-charity|2.8.3 Gifts to Charity
284the-high-income-child-benefit-charge|2.8.4 The High Income Child Benefit Charge
S|2.9|Basic Income Tax Planning
291tax-free-investments|2.9.1 Tax-Free Investments

C|3|Property and Investment Income
S|3.1|Property Business Profits
311-general-principles|3.1.1 General Principles
312-property-income-cash-basis|3.1.2 Property Income – Cash Basis
313-allowable-expenses-cash-basis|3.1.3 Allowable Expenses – Cash Basis
314-finance-cost-restriction|3.1.4 Finance Cost Restriction
315-capital-expenditure-cash-basis|3.1.5 Capital Expenditure – Cash Basis
316-property-income-accruals-basis|3.1.6 Property Income – Accruals Basis
317-lease-premiums|3.1.7 Lease Premiums
318-rent-a-room-letting|3.1.8 Rent-a-Room Letting
319-losses-and-loss-relief|3.1.9 Losses and Loss Relief
S|3.2|Investment Income
321-exempt-income|3.2.1 Exempt Income
322-individual-savings-accounts-isa|3.2.2 Individual Savings Accounts (ISA)
323-accrued-income-scheme|3.2.3 Accrued Income Scheme

C|4|Employment Income
S|4.1|Employment or Self-Employment
411-practical-significance|4.1.1 Practical Significance
412-why-hmrc-prefers-employee-status|4.1.2 Why HMRC Prefers Employee Status
413-proof-of-employee-status|4.1.3 Proof of Employee Status
S|4.2|Employment Income
421-types-of-income|4.2.1 Types of Income
422-pro-forma-computation|4.2.2 Pro Forma Computation
S|4.3|Earnings (or Pay)
431-basis-of-assessment|4.3.1 Basis of Assessment
432-expense-allowances-and-reimbursed-expenses|4.3.2 Expense Allowances and Reimbursed Expenses
433-allowable-expenses-of-employment|4.3.3 Allowable Expenses of Employment
434-claiming-tax-relief-for-expenses|4.3.4 Claiming Tax Relief for Expenses

C|5|Benefits and the PAYE System
S|5.1|Benefits
511-summary|5.1.1 Summary
512-exempt-benefits|5.1.2 Exempt Benefits
513-assessable-benefits|5.1.3 Assessable Benefits
514-cash-equivalent-values|5.1.4 Cash Equivalent Values
515-summary-of-benefits-assessable-on-all-employees|5.1.5 Summary of Benefits Assessable on All Employees
516-living-accommodation|5.1.6 Living Accommodation
517-job-related-living-accommodation|5.1.7 Job-Related Living Accommodation
518-vehicles-and-fuel-for-private-purposes|5.1.8 Vehicles and Fuel for Private Purposes
519-loans-and-loan-interest-benefits|5.1.9 Loans and Loan Interest Benefits
5110-use-of-assets-other-than-vehicles-fuel-accommodation-and-loans|5.1.10 Use of Assets Other Than Vehicles, Fuel, Accommodation and Loans
5111-transfers-of-used-assets|5.1.11 Transfers of Used Assets
S|5.2|PAYE (Pay As You Earn)
521-scope|5.2.1 Scope
522-tax-collection-at-source|5.2.2 Tax Collection at Source
523-notice-of-coding|5.2.3 Notice of Coding
524-weekly-or-monthly-procedures-real-time-information|5.2.4 Weekly or Monthly Procedures – Real Time Information
525-paye-penalties|5.2.5 PAYE Penalties
526-year-end-procedures|5.2.6 Year-End Procedures
527-payrolling-benefits|5.2.7 Payrolling Benefits
528-employees-changing-employment|5.2.8 Employees Changing Employment

C|6|Unincorporated Traders – Assessment and Profits
S|6.1|Badges of Trade
611-introduction|6.1.1 Introduction
612-badges-of-trade|6.1.2 Badges of Trade
S|6.2|Cash Basis and Accruals Basis
621-introduction|6.2.1 Introduction
622-income-and-expenses-under-the-cash-basis|6.2.2 Income and Expenses Under the Cash Basis
623-simplified-expenses-2|6.2.3 Simplified Expenses
S|6.3|Adjustment of Profit
631-introduction-1|6.3.1 Introduction
632-process-for-arriving-at-assessable-profits-for-a-tax-year|6.3.2 Process for Arriving at Assessable Profits for a Tax Year
633-pro-forma-computation|6.3.3 Pro-Forma Computation
634-general-principles-of-profit-adjustment|6.3.4 General Principles of Profit Adjustment
S|6.4|Disallowable Expenditure
641-capital-expenditure|6.4.1 Capital Expenditure
642-expenses-not-wholly-and-exclusively-for-trading-purposes|6.4.2 Expenses Not 'Wholly and Exclusively' for Trading Purposes
643-appropriations-by-proprietors|6.4.3 Appropriations by Proprietor(s)
S|6.5|Pre-trading Expenditure
651-pre-trading-expenditure-2|6.5.1 Pre-trading Expenditure
S|6.6|Basis of Assessment Rules
661-tax-year-basis|6.6.1 Tax Year Basis
662-use-of-provisional-figures|6.6.2 Use of Provisional Figures
663-new-businesses|6.6.3 New Businesses
664-cessation-of-a-business-1|6.6.4 Cessation of a Business
665-transition-profits|6.6.5 Transition Profits

C|7|Capital Allowances
S|7.1|Tax Depreciation
711-the-concept|7.1.1 The Concept
712-eligible-capital-expenditure|7.1.2 Eligible Capital Expenditure
S|7.2|Computational Principles
721-chargeable-period|7.2.1 Chargeable Period
722-allowances|7.2.2 Allowances
723-pooling-and-exceptions-to-pooling|7.2.3 Pooling and Exceptions to Pooling
724-main-pool-18-wda|7.2.4 Main Pool (18% WDA)
725-special-rate-pool-6-wda|7.2.5 Special Rate Pool (6% WDA)
726-pro-forma-1-capital-allowances-computation-ignoring-item-by-item-basis|7.2.6 Pro Forma 1 – Capital Allowances Computation (Ignoring Item-by-Item Basis)
727-disposal-value|7.2.7 Disposal Value
728-the-item-by-item-basis|7.2.8 The Item-by-Item Basis
729-pro-forma-2-capital-allowances-computation-including-item-by-item-basis|7.2.9 Pro Forma 2 – Capital Allowances Computation (Including Item-by-Item Basis)
7210-balancing-adjustments|7.2.10 Balancing Adjustments
7211-small-pool-balances|7.2.11 Small Pool Balances
7212-cessation-of-trading|7.2.12 Cessation of Trading
7213-short-life-asset-election|7.2.13 Short Life Asset Election
7214-structures-and-buildings-allowance|7.2.14 Structures and Buildings Allowance
7215-other-matters|7.2.15 Other Matters
S|7.3|Short and Long Periods of Account
731-periods-less-than-12-months|7.3.1 Periods Less Than 12 Months
732-long-periods-more-than-12-months-income-tax-only|7.3.2 Long Periods – More Than 12 Months (Income Tax Only)

C|8|Unincorporated Traders – Relief for Trading Losses
S|8.1|Trading Loss for Tax Purposes
811-tax-adjusted-loss|8.1.1 Tax Adjusted Loss
812-identification-of-the-loss-with-the-tax-year|8.1.2 Identification of the Loss With the Tax Year
S|8.2|Established Businesses
821-options-for-loss-relief|8.2.1 Options for Loss Relief
822-set-off-against-total-income|8.2.2 Set Off Against Total Income
823-carry-forward-against-future-trading-profits|8.2.3 Carry Forward Against Future Trading Profits
824-set-off-against-chargeable-gains|8.2.4 Set Off Against Chargeable Gains
S|8.3|Commencement of Trade
831-options-for-loss-relief|8.3.1 Options for Loss Relief
832-set-off-against-total-income-of-previous-tax-years|8.3.2 Set Off Against Total Income of Previous Tax Years
S|8.4|Cessation of Trade
841-options|8.4.1 Options
842-terminal-loss-relief|8.4.2 Terminal Loss Relief
S|8.5|Loss Relief Planning
851-objectives|8.5.1 Objectives
852choice-of-loss-relief-claim|8.5.2 Choice of Loss Relief Claim

C|9|Partnerships
S|9.1|Partnerships
911-introduction|9.1.1 Introduction
S|9.2|Allocations of Trading Profits and Losses
921-allocations-of-trading-profits-and-losses-between-partners|9.2.1 Allocations of Trading Profits and Losses Between Partners
922-changes-to-profit-sharing-ratio|9.2.2 Changes to Profit Sharing Ratio
923-capital-allowances|9.2.3 Capital Allowances
S|9.3|Admission and Retirement of Partners
931-admission-of-new-partners|9.3.1 Admission of New Partners
932-retirement-of-partners|9.3.2 Retirement of Partners
933-cessation-of-the-firm-as-a-whole|9.3.3 Cessation of the Firm as a Whole
S|9.4|Loss Relief
941-trading-loss-relief-for-a-partner|9.4.1 Trading Loss Relief for a Partner
S|9.5|Limited Liability Partnerships
951-limited-liability-partnerships-llps|9.5.1 Limited Liability Partnerships (LLPs)

C|10|National Insurance
S|10.1|National Insurance
1011-contributions|10.1.1 Contributions
S|10.2|National Insurance for Employers and Employees
1021-class-1-contributions|10.2.1 Class 1 Contributions
1022-class-1-employee-contributions|10.2.2 Class 1 Employee Contributions
1023-class-1-employer-contributions|10.2.3 Class 1 Employer Contributions
1024-annual-employment-allowance|10.2.4 Annual Employment Allowance
1025-class-1a-contributions|10.2.5 Class 1A Contributions
S|10.3|National Insurance for the Self-Employed
1031-class-4-contributions|10.3.1 Class 4 Contributions
1032-contrast-with-employees|10.3.2 Contrast with Employees

C|11|Income Tax Administration
S|11.1|Self-Assessment – Individuals
1111-introduction|11.1.1 Introduction
1112-completion-of-the-tax-return|11.1.2 Completion of the Tax Return
1113-information-and-records|11.1.3 Information and Records
1114-payment-of-tax|11.1.4 Payment of Tax
V|Video: Self assessment for individuals|1115-topic-explainer-video-self-assessment-on-individuals
S|11.2|Claims for Tax Reliefs
1121-procedure|11.2.1 Procedure
1122-time-limit|11.2.2 Time Limit
S|11.3|Enforcement
1131-introduction|11.3.1 Introduction
1132-late-submission-of-a-return-income-tax-and-cgt|11.3.2 Late Submission of a Return – Income Tax and CGT
1133-failure-to-retain-tax-records|11.3.3 Failure to Retain Tax Records
1134-late-notification-of-a-new-source-of-income|11.3.4 Late Notification of a New Source of Income
1135-interest-on-tax-paid-late-and-repaid|11.3.5 Interest on Tax Paid Late and Repaid
1136-late-payment-penalties-surcharges-for-income-tax-and-cgt|11.3.6 Late Payment Penalties (Surcharges) for Income Tax and CGT
S|11.4|HMRC Compliance Checks
1141-initiation-of-enquiries|11.4.1 Initiation of Enquiries
1142-cessation-of-a-compliance-check|11.4.2 Cessation of a Compliance Check
1143-discovery-assessment|11.4.3 Discovery Assessment
1144-penalties-for-incorrect-returns|11.4.4 Penalties for Incorrect Returns
S|11.5|Appeals Against Assessments
1151-appeals-against-assessments|11.5.1 Appeals Against Assessments
1152-resolution-of-disputes|11.5.2 Resolution of Disputes
1153-hmrc-statutory-reviews|11.5.3 HMRC Statutory Reviews
1154-appeal-tribunals|11.5.4 Appeal Tribunals

C|12|Chargeable Gains for Individuals – Basic Principles
S|12.1|Terminology
1211-capital-gains-tax|12.1.1 Capital Gains Tax
1212-chargeable-disposals|12.1.2 Chargeable Disposals
1213-chargeable-assets|12.1.3 Chargeable Assets
1214-chargeable-persons|12.1.4 Chargeable Persons
S|12.2|Tax Computation – Personal Taxpayers
1221-pro-forma-computation|12.2.1 Pro-Forma Computation
1222-disposal-proceeds|12.2.2 Disposal Proceeds
1223-incidental-costs-of-disposal|12.2.3 Incidental Costs of Disposal
1224-calculation-of-tax-payable-for-individuals-3|12.2.4 Calculation of Tax Payable for Individuals
1225-loss-relief-for-personal-taxpayers-1|12.2.5 Loss Relief for Personal Taxpayers
1226-residential-property-disposals-for-individuals-1|12.2.6 Residential Property Disposals for Individuals
1227-married-couples-1|12.2.7 Married Couples
1228-basic-cgt-planning|12.2.8 Basic CGT Planning
S|12.3|Computation – Corporate Taxpayers
1231-chargeable-gains-for-companies|12.3.1 Chargeable Gains for Companies

C|13|Chargeable Gains – Chattels, Land and Buildings
S|13.1|Disposals of Chattels and Wasting Assets
1311-terminology|13.1.1 Terminology
1312-chargeable-disposals-of-chattels|13.1.2 Chargeable Disposals of Chattels
1313-chargeable-disposal-of-a-wasting-asset|13.1.3 Chargeable Disposal of a Wasting Asset
S|13.2|Disposals of Land and Buildings
1321-introduction|13.2.1 Introduction
1322-part-disposals|13.2.2 Part Disposals
1323-private-residence-relief-prr|13.2.3 Private Residence Relief (PRR)
S|13.3|Lost or Damaged Assets
1331-loss-or-destruction-of-assets|13.3.1 Loss or Destruction of Assets
1332-damage-to-non-wasting-assets|13.3.2 Damage to Non-wasting Assets

C|14|Chargeable Gains – Shares
S|14.1|Shares
1411-disposals|14.1.1 Disposals
1412-valuation|14.1.2 Valuation
1413-identification|14.1.3 Identification
S|14.2|Share Identification – Personal Taxpayers
1421-identification-rules|14.2.1 Identification Rules
1422-computational-pro-forma-personal-taxpayers|14.2.2 Computational Pro Forma – Personal Taxpayers
S|14.3|Bonus and Rights Issues
1431-bonus-issues-or-scrip-issues|14.3.1 Bonus Issues (or Scrip Issues)
1432-rights-issues|14.3.2 Rights Issues
S|14.4|Reorganisations of Share Capital
1441-introduction|14.4.1 Introduction
1442-share-for-share-exchange|14.4.2 Share-for-Share Exchange
1443-mixed-consideration-shares-and-cash|14.4.3 Mixed Consideration – Shares and Cash

C|15|Chargeable Gains – Business Assets/Reliefs
S|15.1|Reliefs
1511-practical-need-for-the-reliefs|15.1.1 Practical Need for the Reliefs
1512-types-of-relief|15.1.2 Types of Relief
S|15.2|Rollover Relief
1521-operation-of-the-relief|15.2.1 Operation of the Relief
1522-pro-forma|15.2.2 Pro-Forma
1523-conditions-for-relief|15.2.3 Conditions for Relief
1524-claim|15.2.4 Claim
1525-partial-reinvestment|15.2.5 Partial Reinvestment
1526-modified-rollover-reliefdepreciating-assets|15.2.6 Modified Rollover Relief/Depreciating Assets
V|Video: Chargeable gains tax reliefs|1527-topic-explainer-video-chargeable-gains-tax-reliefs
S|15.3|Gift Holdover Relief for Business Assets
1531-normal-calculation-of-a-gain-on-a-gift|15.3.1 Normal Calculation of a Gain on a Gift
1532-operation-of-the-relief|15.3.2 Operation of the Relief
1533-pro-formas|15.3.3 Pro-Formas
1534-conditions-for-relief|15.3.4 Conditions for Relief
1535-non-trade-use|15.3.5 Non-trade Use
1536-claim|15.3.6 Claim
1537-sale-at-undervalue|15.3.7 Sale at Undervalue
S|15.4|Business Asset Disposal Relief
1541-introduction|15.4.1 Introduction
1542-the-relief|15.4.2 The Relief
1543-material-disposals|15.4.3 Material Disposals
1544-claim|15.4.4 Claim
1545-investors-relief|15.4.5 Investors' Relief
S|15.5|Interaction of BADR With Rollover/Gift Holdover Reliefs
1551-with-rollover-relief|15.5.1 With Rollover Relief
1552-with-gift-holdover-relief|15.5.2 With Gift Holdover Relief

C|16|Corporation Tax – The Tax Computation & Administration
S|16.1|Introduction
1611-assessable-profits|16.1.1 Assessable Profits
1612-accounting-period|16.1.2 Accounting Period
1613-basis-of-assessment|16.1.3 Basis of Assessment
1614-differences-in-tax-treatment-between-companies-and-individuals|16.1.4 Differences in Tax Treatment Between Companies and Individuals
S|16.2|The Taxation of Distributed Profits
1621-dividends-paid|16.2.1 Dividends Paid
1622-employee-remuneration-loan-note-interest-and-patent-royalties-1|16.2.2 Employee Remuneration, Loan Note Interest and Patent Royalties
S|16.3|The Corporation Tax Computation
1631-uk-profits|16.3.1 UK Profits
1632-pro-forma-computation|16.3.2 Pro Forma Computation
S|16.4|Computation of Corporation Tax Liability
1641-basic-rules|16.4.1 Basic Rules
1642-marginal-relief|16.4.2 Marginal Relief
1643-effective-marginal-rate-of-tax|16.4.3 Effective Marginal Rate of Tax
1644-short-accounting-periods|16.4.4 Short Accounting Periods
1645-accounting-periods-straddling-1-april-2023|16.4.5 Accounting Periods Straddling 1 April 2023
1646-associated-companies|16.4.6 Associated Companies
S|16.5|Self-Assessment – Companies
1651-introduction|16.5.1 Introduction
1652-completion-of-the-tax-return|16.5.2 Completion of the Tax Return
1653-notification-of-chargeability|16.5.3 Notification of Chargeability
1654-online-submission-of-the-tax-return|16.5.4 Online Submission of the Tax Return
1655-payment-of-corporation-tax|16.5.5 Payment of Corporation Tax
V|Video: Self assessment for companies|1656-topic-explainer-video-self-assessment-on-companies
S|16.6|Claims for Tax Reliefs
1661-procedure|16.6.1 Procedure
1662-time-limit|16.6.2 Time Limit
S|16.7|Enforcement
1671-introduction|16.7.1 Introduction
1672-late-submission-of-a-corporation-tax-return|16.7.2 Late Submission of a Corporation Tax Return
1673-failure-to-retain-tax-records|16.7.3 Failure to Retain Tax Records
1674-interest-on-tax-paid-late-and-repaid|16.7.4 Interest on Tax Paid Late and Repaid
1675-penalties-for-incorrect-returns|16.7.5 Penalties for Incorrect Returns
S|16.8|Choice of Business Medium
1681-sole-trader-or-limited-company|16.8.1 Sole Trader or Limited Company

C|17|Corporation Tax – Taxable Total Profits
S|17.1|Taxable Total Profits (TTP)
1711-taxable-total-profits|17.1.1 Taxable Total Profits
1712-tax-adjusted-trading-profit|17.1.2 Tax Adjusted Trading Profit
1713-main-examples-of-disallowable-expenditure|17.1.3 Main Examples of Disallowable Expenditure
1714-pre-trading-expenditure|17.1.4 Pre-trading Expenditure
1715-charitable-donations|17.1.5 Charitable Donations
1716-property-business-income|17.1.6 Property Business Income
1717-interest-loan-relationship-rules|17.1.7 Interest – Loan Relationship Rules
S|17.2|Capital Allowances for Companies
1721-capital-allowances-for-companies|17.2.1 Capital Allowances for Companies
1722-key-differences-with-capital-allowances-for-companies|17.2.2 Key Differences with Capital Allowances for Companies
1723-enhanced-capital-allowances-for-companies-only|17.2.3 Enhanced Capital Allowances for Companies Only
1724-disposal-of-assets-on-which-enhanced-capital-allowances-claimed|17.2.4 Disposal of Assets on which Enhanced Capital Allowances Claimed
1725-enhanced-capital-allowances-restriction|17.2.5 Enhanced Capital Allowances Restriction
1726-enhanced-capital-allowances-for-expenditure-incurred-between-1-april-2021-to-31-march-2023|17.2.6 Enhanced Capital Allowances for Expenditure 1 April 2021 – 31 March 2023
1727-capital-allowances-planning-for-companies|17.2.7 Capital Allowances Planning for Companies
V|Video: Capital allowances|1728-topic-explainer-video-capital-allowances
S|17.3|Property Business Income
1731-introduction|17.3.1 Introduction
1732-differences-between-the-corporation-tax-and-income-tax-treatments|17.3.2 Differences Between the Corporation Tax and Income Tax Treatments
S|17.4|Long Periods of Account
1741-two-computations|17.4.1 Two Computations
1742-rules-for-allocating-profits|17.4.2 Rules for Allocating Profits
1743-calculating-the-tax-liabilities|17.4.3 Calculating the Tax Liabilities

C|18|Corporation Tax – Chargeable Gains for Companies
S|18.1|Chargeable Gains for Companies
1811-chargeable-gains-for-companies|18.1.1 Chargeable Gains for Companies
1812-pro-forma-computation-corporate-taxpayers|18.1.2 Pro-Forma Computation – Corporate Taxpayers
1813-indexation-allowance-ia|18.1.3 Indexation Allowance (IA)
S|18.2|Capital Losses for Companies
1821-capital-losses-for-companies|18.2.1 Capital Losses for Companies
S|18.3|Calculation of Tax Liability
1831-calculation-of-tax-liability|18.3.1 Calculation of Tax Liability
S|18.4|Disposals of Shares by Companies
1841-share-identification-rules-corporate-taxpayers|18.4.1 Share Identification Rules – Corporate Taxpayers
1842-operation-of-the-indexed-pool|18.4.2 Operation of the Indexed Pool
1843-computational-pro-forma-corporate-taxpayers|18.4.3 Computational Pro Forma – Corporate Taxpayers
S|18.5|Bonus and Rights Issues
1851-bonus-issues-or-scrip-issues|18.5.1 Bonus Issues (or Scrip Issues)
1852-rights-issues|18.5.2 Rights Issues
S|18.6|Reorganisations of Share Capital
1861-reorganisations-of-share-capital-for-corporate-shareholders|18.6.1 Reorganisations of Share Capital for Corporate Shareholders
S|18.7|Rollover Relief for Companies
1871-conditions-for-relief|18.7.1 Conditions for Relief
1872-operation-of-relief|18.7.2 Operation of Relief
1873-claim|18.7.3 Claim
1874-depreciating-assets|18.7.4 Depreciating Assets

C|19|Corporation Tax – Loss Reliefs
S|19.1|Continuing Trades
1911-trading-loss|19.1.1 Trading Loss
1912-loss-reliefs|19.1.2 Loss Reliefs
1913-pro-forma-corporation-tax-computation-with-trading-loss-reliefs|19.1.3 Pro Forma Corporation Tax Computation (With Trading Loss Reliefs)
1914-effects-of-loss-relief|19.1.4 Effects of Loss Relief
1915-computational-technique|19.1.5 Computational Technique
S|19.2|Cessation of Trade
1921-terminal-loss-relief|19.2.1 Terminal Loss Relief
S|19.3|Other Losses
1931-property-business-losses|19.3.1 Property Business Losses
1932-capital-losses|19.3.2 Capital Losses
1933-interaction-with-trading-loss-relief|19.3.3 Interaction With Trading Loss Relief
1934-factors-influencing-choice-of-loss-relief|19.3.4 Factors Influencing Choice of Loss Relief

C|20|Corporation Tax – Groups of Companies
S|20.1|Taxable Entities
2011-taxable-entities|20.1.1 Taxable Entities
S|20.2|Group Relief for Losses in a 75% Group
2021-definition-of-a-75-group|20.2.1 Definition of a 75% Group
2022-principles-of-group-relief|20.2.2 Principles of Group Relief
2023-loss-relief-and-group-relief|20.2.3 Loss Relief and Group Relief
2024-planning|20.2.4 Planning
2025-non-coterminous-accounting-periods|20.2.5 Non-coterminous Accounting Periods
2026-companies-joining-or-leaving-the-group|20.2.6 Companies Joining or Leaving the Group
S|20.3|Capital Gains/Losses in a Gains Group
2031-definition-of-a-gains-group|20.3.1 Definition of a Gains Group
2032-intra-group-transfer-of-assets|20.3.2 Intra-group Transfer of Assets
2033-tax-effective-uses-of-the-no-gain-no-loss-rule|20.3.3 Tax Effective Uses of the No Gain/No Loss Rule
2034-notional-intra-group-transfers-of-assets|20.3.4 Notional Intra-group Transfers of Assets
2035-group-rollover-relief|20.3.5 Group Rollover Relief

C|21|Inheritance Tax
S|21.1|Introduction
2111-concept|21.1.1 Concept
2112-scope-of-the-charge|21.1.2 Scope of the Charge
2113-transfer-of-value|21.1.3 Transfer of Value
2114-property-for-iht-purposes|21.1.4 Property for IHT Purposes
2115-chargeable-transfer|21.1.5 Chargeable Transfer
S|21.2|IHT Occasions of Charge
2121-occasions-of-charge|21.2.1 Occasions of Charge
2122-lifetime-transfers|21.2.2 Lifetime Transfers
S|21.3|Exemptions
2131-exemptions-applying-to-lifetime-transfers-and-death-estate-spouse-exemption|21.3.1 Exemptions Applying to Lifetime Transfers and Death Estate – Spouse Exemption
2132-exemptions-applying-to-lifetime-transfers-only|21.3.2 Exemptions Applying to Lifetime Transfers Only
S|21.4|Computation of IHT Payable During Lifetime
2141-iht-on-lifetime-transfers|21.4.1 IHT on Lifetime Transfers
2142-calculation-of-iht-on-chargeable-lifetime-transfers-clt-stage-1-computation|21.4.2 IHT on Chargeable Lifetime Transfers (Stage 1 Computation)
2143-the-nil-rate-band|21.4.3 The Nil Rate Band
2144-the-seven-year-accumulation-principle|21.4.4 The Seven Year Accumulation Principle
S|21.5|Computation of IHT Payable on Death
2151-iht-arising-as-a-result-of-death|21.5.1 IHT Arising as a Result of Death
2152-death-tax-on-lifetime-transfers-stage-2-computation|21.5.2 Death Tax on Lifetime Transfers (Stage 2 Computation)
2153-iht-on-the-death-estate-stage-3-computation|21.5.3 IHT on the Death Estate (Stage 3 Computation)
S|21.6|Nil Rate Bands
2161-nil-rate-bands-and-tax-rates|21.6.1 Nil Rate Bands and Tax Rates
2162-residence-nil-rate-band|21.6.2 Residence Nil Rate Band
2163-married-couples-and-civil-partners-transfer-of-nil-rate-bands|21.6.3 Married Couples and Civil Partners – Transfer of Nil Rate Bands
S|21.7|Administration of Inheritance Tax
2171-introduction|21.7.1 Introduction
2172-due-dates-of-payment-of-tax|21.7.2 Due Dates of Payment of Tax
2173-responsibility-for-payment-and-incidence-of-tax|21.7.3 Responsibility for Payment and Incidence of Tax
S|21.8|Basic IHT Planning
2181-lifetime-tax-planning|21.8.1 Lifetime Tax Planning
2182-death-estate-planning|21.8.2 Death Estate Planning
2183-skipping-generations|21.8.3 Skipping Generations

C|22|Value Added Tax
S|22.1|Scope of Value Added Tax (VAT)
221-scope-of-value-added-tax-vat|22.1.0 Scope of Value Added Tax (VAT)
2211-concept|22.1.1 Concept
2212-general-definition-of-vat|22.1.2 General Definition of VAT
2213-taxable-supplies|22.1.3 Taxable Supplies
2214-exempt-supplies-for-vat-purposes|22.1.4 Exempt Supplies for VAT Purposes
2215-supplies-outside-the-scope-of-vat|22.1.5 Supplies "Outside the Scope" of VAT
2216-zero-rated-supplies-for-vat-purposes|22.1.6 Zero-Rated Supplies for VAT Purposes
2217-taxable-person|22.1.7 Taxable Person
S|22.2|Registration and Deregistration
2221-compulsory-registration|22.2.1 Compulsory Registration
2222-late-registration|22.2.2 Late Registration
2223-voluntary-registration|22.2.3 Voluntary Registration
2224-exemption-from-registration|22.2.4 Exemption From Registration
2225-deregistration|22.2.5 Deregistration
2226-transfer-of-a-business-as-a-going-concern|22.2.6 Transfer of a Business as a Going Concern
S|22.3|Group VAT Registration
2231-introduction|22.3.1 Introduction
2232-definition-of-a-group-for-vat-purposes|22.3.2 Definition of a Group for VAT Purposes
2233-effect-of-group-registration|22.3.3 Effect of Group Registration
2234-advantages-of-group-registration|22.3.4 Advantages of Group Registration
S|22.4|Recovery of Input VAT
2241-basic-rules|22.4.1 Basic Rules
2242-irrecoverable-input-vat|22.4.2 Irrecoverable Input VAT
2243-pre-registration-expenditure|22.4.3 Pre-registration Expenditure
S|22.5|Output VAT
2251-place-of-supply|22.5.1 Place of Supply
2252-tax-value-of-a-supply|22.5.2 Tax Value of a Supply
2253-time-of-supply-the-tax-point|22.5.3 Time of Supply – The Tax Point
2254-gifts-of-goods-and-services|22.5.4 Gifts of Goods and Services
2255-car-expenses-and-fuel-for-private-use|22.5.5 Car Expenses and Fuel for Private Use
2256-impairment-losses|22.5.6 Impairment Losses
S|22.6|VAT On Exports and Imports
2261-exports-of-goods-and-services-to-countries-outside-the-uk|22.6.1 Exports of Goods and Services to Countries Outside the UK
2262-import-of-goods-and-services-from-outside-the-uk-and-postponed-accounting|22.6.2 Import of Goods and Services From Outside the UK and Postponed Accounting
2263-import-of-services-from-outside-the-uk-international-services|22.6.3 Import of Services from Outside the UK – International Services
S|22.7|VAT Accounting – General Arrangements
2271-introduction|22.7.1 Introduction
2272-tax-periods|22.7.2 Tax Periods
2273-underlying-accounting-records|22.7.3 Underlying Accounting Records
2274-tax-invoices|22.7.4 Tax Invoices
2275-credit-notes|22.7.5 Credit Notes
2276-vat-returns|22.7.6 VAT Returns
2277-errors|22.7.7 Errors
2278-late-filing-submission-penalties|22.7.8 Late Filing (Submission) Penalties
2279-late-payment-penalties|22.7.9 Late Payment Penalties
22710-late-payment-interest|22.7.10 Late Payment Interest
22711-reasonable-excuse|22.7.11 Reasonable Excuse
22712-payment-by-large-businesses-substantial-traders|22.7.12 Payment by Large Businesses – Substantial Traders
S|22.8|VAT Accounting – Small Business Schemes
2281-annual-accounting|22.8.1 Annual Accounting
2282-cash-accounting|22.8.2 Cash Accounting
2283-flat-rate-scheme-for-small-businesses|22.8.3 Flat-Rate Scheme for Small Businesses
`;

/** Study Hub book URL (everything before `#read/section/`). */
export const TX_HUB_BASE = 'https://studymaterials.accaglobal.com/app/for-exams-from-june-2026-to-june-2027-tx-uk-taxation-uk';

/** Chapters whose "Technical Articles" page has a different slug because it includes explainer video(s). */
export const TX_ARTICLE_SLUG: Record<number, string> = {
  7: '7-technical-articles-and-topic-explainer-video',
  8: '8-technical-articles-and-topic-explainer-video',
  11: '11-technical-articles-and-topic-explainer-video',
  14: '14-technical-articles-and-topic-explainer-video',
  16: '16-technical-articles-and-topic-explainer-video',
  19: '19-technical-articles-and-topic-explainer-video',
  20: '20-technical-articles-and-topic-explainer-video',
  21: '21-technical-articles-and-topic-explainer-videos',
  22: '22-technical-articles-and-topic-explainer-videos',
};
