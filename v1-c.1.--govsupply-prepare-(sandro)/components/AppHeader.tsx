import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AIIcon } from './icons/AIIcon';
import { LayoutGridIcon } from './icons/LayoutGridIcon';
import { Button } from './common/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { EditIcon } from './icons/EditIcon';

interface AppHeaderProps {
    onShowDashboard: () => void;
    onGoHome: () => void;
    activeTenderName?: string;
    onRename: () => void;
    isSidebarVisible: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onShowDashboard, onGoHome, activeTenderName, onRename, isSidebarVisible }) => {
    const { t } = useLanguage();
    return (
        <header className="bg-white/80 dark:bg-navy/80 backdrop-blur-lg sticky top-0 z-40 border-b border-medium-gray/20 dark:border-white/10 flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex justify-between items-center h-20 gap-4">
                    {!isSidebarVisible ? (
                        <button onClick={onGoHome} className="flex items-center gap-3 text-left flex-shrink-0">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                <AIIcon className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-navy dark:text-white hidden sm:block">{t('app.title')}</h1>
                        </button>
                    ) : <div className="w-10 flex-shrink-0" /> /* Spacer to align with sidebar logo */}
                    
                    {activeTenderName && (
                        <div className="flex items-center justify-center gap-2 font-semibold text-navy/80 dark:text-light-gray/80 min-w-0 flex-1">
                           <span className="truncate" title={activeTenderName}>{activeTenderName}</span>
                           <button 
                                onClick={onRename}
                                className="p-1 rounded-md text-medium-gray hover:text-primary transition-colors flex-shrink-0"
                                aria-label={t('app.renameTenderTitle')}
                           >
                               <EditIcon className="w-4 h-4" />
                           </button>
                        </div>
                    )}

                    <div className="flex items-center gap-4 flex-shrink-0">
                         {!isSidebarVisible && (
                             <Button variant="secondary" onClick={onShowDashboard}>
                                <LayoutGridIcon className="w-5 h-5 sm:mr-2 text-navy/80 dark:text-light-gray/80" />
                                <span className="hidden sm:inline">{t('app.myTenders')}</span>
                             </Button>
                         )}
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
