const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'client', 'src', 'pages');

const filesToWrap = [
  { name: 'AIReports.jsx', activeTab: 'AI Reports' },
  { name: 'AIReportDetails.jsx', activeTab: 'AI Reports' },
  { name: 'Settings.jsx', activeTab: 'Settings' },
  { name: 'Notifications.jsx', activeTab: '' },
];

const getSidebarItemStr = (activeTab) => `
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={\`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left \${
      active 
        ? 'bg-primary-50 text-primary-600 font-medium' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }\`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);
`;

const getLayoutTop = (activeTab) => `
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Cloud className="text-primary-500 w-8 h-8" />
              <span className="text-xl font-bold text-slate-800 tracking-tight">WeatherPlan</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-600 hidden sm:block">{user?.name}</span>
              <button onClick={handleLogout} className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-slate-200 py-8 pr-6 pl-4 lg:pl-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-1">
            <div className="px-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</div>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/dashboard')} active={${activeTab === 'Dashboard'}} />
            <SidebarItem icon={CloudSun} label="Current Weather" onClick={() => navigate('/current-weather')} active={${activeTab === 'Current Weather'}} />
            <SidebarItem icon={Map} label="Trip Planner" onClick={() => navigate('/trip-planner')} active={${activeTab === 'Trip Planner'}} />
            <SidebarItem icon={Briefcase} label="My Trips" onClick={() => navigate('/my-trips')} active={${activeTab === 'My Trips'}} />
            <SidebarItem icon={Compass} label="Outdoor Activity" onClick={() => navigate('/outdoor-activity')} active={${activeTab === 'Outdoor Activity'}} />
            <SidebarItem icon={Sparkles} label="Work Planner" onClick={() => navigate('/work-planner')} active={${activeTab === 'Work Planner'}} />
            <SidebarItem icon={FileText} label="AI Reports" onClick={() => navigate('/ai-reports')} active={${activeTab === 'AI Reports'}} />
            <SidebarItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} active={${activeTab === 'Settings'}} />
          </nav>
        </aside>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 overflow-y-auto">
`;

filesToWrap.forEach(fileInfo => {
  const filePath = path.join(pagesDir, fileInfo.name);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add missing imports
  const iconsNeeded = ['LayoutDashboard', 'CloudSun', 'Map', 'Compass', 'Briefcase', 'Sparkles', 'Cloud', 'FileText', 'Settings', 'LogOut'];
  const importMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+'lucide-react';/);
  if (importMatch) {
    let existingIcons = importMatch[1].split(',').map(i => i.trim());
    iconsNeeded.forEach(icon => {
      if (!existingIcons.includes(icon)) existingIcons.push(icon);
    });
    content = content.replace(importMatch[0], `import { ${existingIcons.join(', ')} } from 'lucide-react';`);
  } else {
    content = `import { ${iconsNeeded.join(', ')} } from 'lucide-react';\n` + content;
  }

  if (!content.includes('useAuth')) {
    content = content.replace(/import React/, "import React from 'react';\\nimport { useAuth } from '../context/AuthContext';\\n// import React");
  }

  // 2. Add SidebarItem before the main component
  const componentName = fileInfo.name.replace('.jsx', '');
  content = content.replace(new RegExp(`const ${componentName} = `), getSidebarItemStr(fileInfo.activeTab) + `\nconst ${componentName} = `);

  // 3. Inject useAuth and handleLogout if not present inside the component
  const handleLogoutStr = `
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
`;

  if (!content.includes('const handleLogout')) {
    // find the start of the component body
    const compStartRegex = new RegExp(`const ${componentName} = [^{]+\\{([^\\n]*)\\n`);
    content = content.replace(compStartRegex, (match) => {
      return match + handleLogoutStr;
    });
  }
  
  if (fileInfo.name === 'Settings.jsx' && content.includes('const { user, login } = useAuth();')) {
     content = content.replace('const { user, login } = useAuth();', 'const { user, logout } = useAuth();');
  }

  // 4. Replace return statement layout
  const returnRegex = /return\s*\(\s*<div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">/;
  if (returnRegex.test(content)) {
    content = content.replace(returnRegex, getLayoutTop(fileInfo.activeTab));
    // also need to replace the last two closing divs with </div></div></div></main></div></div>
    content = content.replace(/<\/div>\s*<\/div>\s*\);\s*}\s*;\s*export default/, '  </main>\\n      </div>\\n    </div>\\n  );\\n};\\n\\nexport default');
  }

  fs.writeFileSync(filePath, content);
  console.log(`Wrapped ${fileInfo.name}`);
});
