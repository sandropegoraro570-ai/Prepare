import React, { useState, useEffect, useMemo } from 'react';
import { STAGES_CONFIG, STAGES_COUNT } from './constants';
import type { TenderProcess, TenderData, VersionedDocument } from './types';
import Sidebar from './components/Sidebar';
import Stage1InitialData from './components/Stage1_GatherInfo';
import Stage3InternalDocs from './components/Stage3_InternalDocs';
import Stage4Drafting from './components/Stage4_Drafting';
import Stage7Publication from './components/Stage7_Publication';
import TenderDashboard from './components/ProjectDashboard';
import Modal from './components/common/Modal';
import ConfirmationModal from './components/common/ConfirmationModal';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { useLanguage } from './contexts/LanguageContext';
import HomeScreen from './components/HomeScreen';
import RenameModal from './components/common/RenameModal';
import TenderSummaryModal from './components/TenderSummaryModal';
import Footer from './components/Footer';
import AppHeader from './components/AppHeader';


const createInitialVersionedDoc = (name: string): VersionedDocument => {
    const id = `v_${name}_${Date.now()}`;
    return {
        versions: [{
            id,
            name: 'Versión 1',
            content: '',
            timestamp: new Date().toISOString()
        }],
        activeVersionId: id
    };
};

const blankTenderData: Omit<TenderData, 'id' | 'name'> = {
  stage1: {
    expedientNumber: '',
    serviceName: '',
    contractingAuthorityName: '',
    responsibleName: '',
    needs: createInitialVersionedDoc('needs'),
    initialDuration: '',
    extensions: '',
    modifications: '',
    infoSystemUsesAI: null,
    infoSystemInEurope: null,
    infoSystemName: '',
    infoSystemDetails: '',
    usesProtectedData: null,
    usesPersonalData: null,
    protectedDataDetails: createInitialVersionedDoc('protectedDataDetails'),
  },
  stage2: {
    necessityReport: { 
      background: createInitialVersionedDoc('necessity_background'), 
      evaluationCriteria: { 
        valueJudgment: createInitialVersionedDoc('necessity_valueJudgment'), 
        quantifiable: '' 
      }, 
      technicalDraft: null 
    },
    creditCertificate: { budgetItem: '', basePrice: '', estimatedPrice: '', vatRate: '21' },
    contractApproval: {
      necessityReportDate: '',
      creditCertificateDate: '',
      boardApprovalDate: '',
      legalReportDate: '',
      financialControlDate: '',
    },
  },
  stage3: { 
    justificationText: '',
    legalChecklist: {
      necessityAndEfficiency: false,
      legalityAndTransparency: false,
      equalityAndCompetition: false,
    },
    justificationDocuments: [],
    pcap: createInitialVersionedDoc('pcap'),
    pptData: {
      object: createInitialVersionedDoc('ppt_object'),
      serviceDescription: {
        description: createInitialVersionedDoc('ppt_serviceDescription'),
        technicalParams: '',
      },
      scope: createInitialVersionedDoc('ppt_scope'),
      infoSystem: createInitialVersionedDoc('ppt_infoSystem'),
      personnelResources: createInitialVersionedDoc('ppt_personnelResources'),
      materialResources: createInitialVersionedDoc('ppt_materialResources'),
      personnelSubrogation: '',
      serviceTransition: {
        plan: '',
      },
      companyObligations: {
        service: '',
        regulatory: '',
        qualityCerts: '',
        other: '',
      },
      penalties: {
        serious: '',
        minor: '',
        other: '',
      },
      liabilityInsurance: '',
      maintenance: {
        preventive: '',
        corrective: '',
        normative: '',
        wasteManagement: '',
      },
      sla: '',
      riskPrevention: '',
    },
    characteristics: createInitialVersionedDoc('characteristics'),
    characteristicsData: {
      object: createInitialVersionedDoc('characteristics_object'),
      cpvCodes: '',
      legalNature: '',
      innovativePurchase: null,
      lotDivision: '',
      numberOfLots: '',
      lots: [],
      lotDivisionJustification: createInitialVersionedDoc('lotDivisionJustification'),
      priceDetermination: '',
      billingType: '',
      baseBudget: '',
      modificationsAmount: '',
      extensionsAmount: '',
      allLotsMandatory: false,
      canBidOnOneOrAllLots: false,
      minLotsToBidRequired: false,
      minLotsToBidCount: '',
      minLotsToBidSelection: {},
      mandatoryLotsToBid: false,
      mandatoryLotsToBidSelection: {},
      mustBidOnFullLots: false,
      multiYearSupply: '',
      multiYearSupplyApprovalDate: '',
      annuities: [],
      anticipatedExpenditure: null,
      estimatedStartDate: '',
      contractDuration: '',
      partialTerms: null,
      partialTermsDetails: '',
      extensionsPossible: null,
      extensionsCount: '',
      extensionDuration: '',
      variantsAdmission: null,
      variantsAdmissionDetails: '',
      procedure: '',
      processingType: '',
      harmonizedRegulation: null,
      priorNotice: null,
      digitalEnvelope: null,
      electronicAuction: null,
      maxProposalDate: '',
      samplesDelivery: '',
      samplesProducts: '',
      samplesLocation: '',
      samplesUnitCount: '',
      samplesIdentification: '',
      samplesSubmissionTime: '',
      provisionalGuarantee: null,
      provisionalGuaranteePerLot: null,
      provisionalGuaranteeLotAmount: '',
      provisionalGuaranteeConstitution: '',
      definitiveGuarantee: null,
      definitiveGuaranteeDetails: '',
      definitiveGuaranteeConstitution: '',
      complementaryGuarantee: null,
      complementaryGuaranteeDetails: '',
      complementaryGuaranteeConstitution: '',
      guaranteeTerm: null,
      guaranteeTermDuration: '',
      guaranteeTermStartDate: '',
      priceReview: null,
      priceReviewDetails: '',
      subcontracting: null,
      subcontractingDetails: createInitialVersionedDoc('subcontractingDetails'),
      assignment: null,
      assignmentDetails: createInitialVersionedDoc('assignmentDetails'),
      solvencyClassificationCategory: '',
      solvencyClassificationGroup: '',
      solvencyClassificationSubgroup: '',
      solvencyEconomicPerLot: null,
      economicSolvencyTypes: {},
      economicSolvencyAmount: '',
      economicSolvencyOtherDetails: '',
      solvencyTechnicalPerLot: null,
      solvencyTechnicalCriteria: {},
      solvencyTechnicalCriteriaOther: '',
      solvencyIntegrationExternalMeans: null,
      solvencyIntegrationCriteria: createInitialVersionedDoc('solvencyIntegrationCriteria'),
      qualityStandardsRequired: null,
      qualityStandardsDetails: '',
      nonHarmonizedCriteria: null,
      nonHarmonizedCriteriaSelection: {},
      materialPersonalResources: null,
      materialResourcesDetails: createInitialVersionedDoc('materialResourcesDetails'),
      personalResourcesDetails: createInitialVersionedDoc('personalResourcesDetails'),
      abnormallyLowTenders: null,
      abnormallyLowTendersDetails: createInitialVersionedDoc('abnormallyLowTendersDetails'),
      otherAwardDocumentation: createInitialVersionedDoc('otherAwardDocumentation'),
      envelopeDocumentation_intro: createInitialVersionedDoc('envelopeDocumentation_intro'),
      envelopeDocumentation_A: { partA: '' },
      envelopeDocumentation_B: [],
      envelopeDocumentation_C: [],
      executionConditions_ethicalPrinciples: false,
      executionConditions_environmentalSocial: false,
      executionConditions_genderPerspective: false,
      executionConditions_communicationDesign: false,
      executionConditions_dataProtection: false,
      executionConditions_labor: false,
      executionConditions_ute: false,
      executionConditions_healthAndSafety: false,
      workProgramRequired: false,
      workProgramDetails: createInitialVersionedDoc('workProgramDetails'),
      promotingUnit: 'Direcció Serveis Generals i Infraestructures del CSA',
      facilityVisitRequired: false,
      facilityVisitIsExclusionary: null,
    },
  },
  stage4: { publicationDate: '', platform: '', link: '', procedureType: 'open' },
  // FIX: Add missing 'stage5' property to satisfy the TenderData type.
  stage5: {
    checklist: {
      procedure: false,
      clauses: false,
      compatibility: false,
    },
    validationDate: '',
    validatorName: '',
    reportContent: createInitialVersionedDoc('stage5_reportContent'),
  },
};

const createInitialTender = (): TenderProcess => {
    const id = `tender_${Date.now()}`;
    return {
        id,
        name: "Nueva Licitación de Suministro de Oficina",
        status: 'draft',
        lastModified: new Date().toISOString(),
        tenderData: {
            ...blankTenderData,
            stage3: {
              ...blankTenderData.stage3,
              pcap: createInitialVersionedDoc('pcap'),
              characteristics: createInitialVersionedDoc('characteristics'),
            },
            id,
            name: "Nueva Licitación de Suministro de Oficina",
        }
    };
};

const AppContent: React.FC = () => {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [tenders, setTenders] = useState<TenderProcess[]>([]);
    const [activeTenderId, setActiveTenderId] = useState<string | null>(null);
    const [currentStage, setCurrentStage] = useState<number>(1);
    const [completedStages, setCompletedStages] = useState<number[]>([]);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [tenderToDelete, setTenderToDelete] = useState<TenderProcess | null>(null);
    const [tenderToRename, setTenderToRename] = useState<TenderProcess | null>(null);
    const [tenderToView, setTenderToView] = useState<TenderProcess | null>(null);


    useEffect(() => {
        try {
            const savedTenders = localStorage.getItem('govSupplyTenders');
            const savedActiveId = localStorage.getItem('govSupplyActiveTender');

            if (savedTenders) {
                setTenders(JSON.parse(savedTenders));
            } else {
                setTenders([createInitialTender()]);
            }
            
            if (savedActiveId) {
                setActiveTenderId(JSON.parse(savedActiveId));
            }

        } catch (error) {
            console.error("Failed to parse state from localStorage", error);
            setTenders([createInitialTender()]);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('govSupplyTenders', JSON.stringify(tenders));
            if (activeTenderId) {
                localStorage.setItem('govSupplyActiveTender', JSON.stringify(activeTenderId));
            } else {
                localStorage.removeItem('govSupplyActiveTender');
            }
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [tenders, activeTenderId]);

    const activeTender = useMemo(() => tenders.find(p => p.id === activeTenderId), [tenders, activeTenderId]);
    const tenderData = activeTender?.tenderData;
    
    const updateTender = (tenderId: string, updatedData: Partial<TenderProcess>) => {
        setTenders(prev => prev.map(p => p.id === tenderId ? { ...p, ...updatedData, lastModified: new Date().toISOString() } : p));
    }
    
    const updateStageData = <S extends keyof TenderData>(stageKey: S, updatedData: Partial<TenderData[S]>) => {
        if (!activeTender) return;
        const newTenderData = {
            ...activeTender.tenderData,
            [stageKey]: {
                ...(activeTender.tenderData[stageKey] as object),
                ...updatedData,
            }
        };
        updateTender(activeTender.id, { tenderData: newTenderData });
    };

    const handleCreateNewTender = () => {
        const newId = `tender_${Date.now()}`;
        const tenderNumber = tenders.length + 1;
        const newTender: TenderProcess = {
            id: newId,
            name: `Nueva Licitación ${tenderNumber}`,
            status: 'draft',
            lastModified: new Date().toISOString(),
            tenderData: {
                ...blankTenderData,
                stage3: { 
                    ...blankTenderData.stage3,
                    pcap: createInitialVersionedDoc('pcap'),
                    characteristics: createInitialVersionedDoc('characteristics'),
                },
                id: newId,
                name: `Nueva Licitación ${tenderNumber}`,
            }
        };
        setTenders(prev => [...prev, newTender]);
        setActiveTenderId(newId);
        setCurrentStage(1);
        setCompletedStages([]);
        setIsDashboardOpen(false);
    };
    
    const handleSelectTender = (tenderId: string) => {
        setActiveTenderId(tenderId);
        setCurrentStage(1); 
        setCompletedStages([]);
        setIsDashboardOpen(false);
    };

    const handleDeleteTender = (tender: TenderProcess) => {
        setTenderToDelete(tender);
    };

    const confirmDeleteTender = () => {
        if (!tenderToDelete) return;
        setTenders(prev => prev.filter(p => p.id !== tenderToDelete.id));
        if (activeTenderId === tenderToDelete.id) {
            setActiveTenderId(null);
        }
        setTenderToDelete(null);
    };

    const confirmRenameTender = (newName: string) => {
        if (!tenderToRename) return;
        updateTender(tenderToRename.id, { name: newName });
        setTenderToRename(null);
    };
    
    const handleNextStage = () => {
        if (!completedStages.includes(currentStage)) {
            setCompletedStages(prev => [...prev, currentStage]);
        }
        if (currentStage < STAGES_COUNT) {
            setCurrentStage(currentStage + 1);
        } else {
            if(activeTender) {
                updateTender(activeTender.id, { status: 'ready_to_publish' });
                showToast(t('app.tenderCreatedSuccess'), 'success');
                handleGoHome();
            }
        }
    };

    const handlePrevStage = () => {
        if (currentStage > 1) {
            setCurrentStage(currentStage - 1);
        }
    };

    const handleSetStage = (stageNumber: number) => {
        if(completedStages.includes(stageNumber) || stageNumber < currentStage) {
            setCurrentStage(stageNumber);
        }
    }
    
    const handleGoHome = () => {
        setActiveTenderId(null);
        setIsDashboardOpen(false);
        setCurrentStage(1);
        setCompletedStages([]);
    };
    
    const handleRenameActiveTender = () => {
        if (activeTender) {
            setTenderToRename(activeTender);
        }
    };

    const renderCurrentStage = () => {
        if (!tenderData) return null;
        const onGoHomeProp = currentStage === 1 ? handleGoHome : undefined;

        switch (currentStage) {
            case 1: return <Stage1InitialData onComplete={handleNextStage} data={tenderData.stage1} updateData={(d) => updateStageData('stage1', d)} onGoHome={onGoHomeProp} tenderData={tenderData} />;
            case 2: return <Stage3InternalDocs onComplete={handleNextStage} onBack={handlePrevStage} data={tenderData.stage2} updateData={(d) => updateStageData('stage2', d)} tenderData={tenderData} />;
            case 3: return <Stage4Drafting onComplete={handleNextStage} onBack={handlePrevStage} data={tenderData.stage3} updateData={(d) => updateStageData('stage3', d)} tenderData={tenderData} onNavigateToStage={handleSetStage} />;
            case 4: return <Stage7Publication onComplete={handleNextStage} onBack={handlePrevStage} data={tenderData.stage4} updateData={(d) => updateStageData('stage4', d)} />;
            default: return <Stage1InitialData onComplete={handleNextStage} data={tenderData.stage1} updateData={(d) => updateStageData('stage1', d)} onGoHome={onGoHomeProp} tenderData={tenderData} />;
        }
    };
    
    const currentStageData = activeTenderId ? {
        name: t(`stages.${currentStage}.name`),
        description: t(`stages.${currentStage}.description`),
    } : undefined;

    return (
        <div className="flex flex-col min-h-screen bg-light-gray dark:bg-dark-blue text-navy dark:text-light-gray">
            <div className="flex flex-1">
                {activeTenderId && (
                    <Sidebar
                        currentStage={currentStage}
                        completedStages={completedStages}
                        onStageSelect={handleSetStage}
                        onShowDashboard={() => setIsDashboardOpen(true)}
                        onGoHome={handleGoHome}
                    />
                )}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AppHeader 
                        onShowDashboard={() => setIsDashboardOpen(true)} 
                        onGoHome={handleGoHome} 
                        activeTenderName={activeTender?.name}
                        onRename={handleRenameActiveTender}
                        isSidebarVisible={!!activeTenderId}
                    />
                    
                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
                        <div className={`${activeTenderId ? 'max-w-5xl' : 'max-w-7xl'} mx-auto`}>
                            {activeTenderId && tenderData ? (
                                <>
                                    {currentStageData && (
                                        <header className="my-8 text-center">
                                            <h1 className="text-4xl font-bold text-navy dark:text-white">{currentStageData.name}</h1>
                                            <p className="text-navy/70 dark:text-light-gray/70 mt-2 max-w-2xl mx-auto">{currentStageData.description}</p>
                                        </header>
                                    )}
                                    
                                    <div className="bg-white dark:bg-navy rounded-xl shadow-lg p-6 sm:p-10 border border-medium-gray/20 dark:border-white/10">
                                        {renderCurrentStage()}
                                    </div>
                                </>
                            ) : (
                                <HomeScreen 
                                    onShowDashboard={() => setIsDashboardOpen(true)} 
                                    onCreateNewTender={handleCreateNewTender}
                                />
                            )}
                        </div>
                    </main>
                </div>
            </div>

            <Footer />

            <Modal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} title={t('app.myTenders')}>
                <TenderDashboard
                    tenders={tenders}
                    onSelectTender={handleSelectTender}
                    onCreateNewTender={handleCreateNewTender}
                    onDeleteTender={handleDeleteTender}
                    onRenameTender={(tender) => setTenderToRename(tender)}
                    onViewTender={(tender) => setTenderToView(tender)}
                />
            </Modal>
            
            <ConfirmationModal
                isOpen={!!tenderToDelete}
                onClose={() => setTenderToDelete(null)}
                onConfirm={confirmDeleteTender}
                title={t('app.deleteTenderTitle')}
                message={tenderToDelete ? t('app.deleteTenderMessage', tenderToDelete.name) : ''}
            />

            <RenameModal
                isOpen={!!tenderToRename}
                onClose={() => setTenderToRename(null)}
                onConfirm={confirmRenameTender}
                currentName={tenderToRename?.name || ''}
                title={t('app.renameTenderTitle')}
                label={t('app.newNameLabel')}
            />

            <TenderSummaryModal
                isOpen={!!tenderToView}
                onClose={() => setTenderToView(null)}
                tender={tenderToView}
            />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    );
};

export default App;