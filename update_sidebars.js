const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'client', 'src', 'pages');

// Find all JSX files in the pages directory
const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.jsx'));

const navBlock = `          <nav className="space-y-1">
            <div className="px-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Menu
            </div>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/dashboard')} active={false} />
            <SidebarItem icon={CloudSun} label="Current Weather" onClick={() => navigate('/current-weather')} active={false} />
            <SidebarItem icon={Map} label="Trip Planner" onClick={() => navigate('/trip-planner')} active={false} />
            <SidebarItem icon={Briefcase} label="My Trips" onClick={() => navigate('/my-trips')} active={false} />
            <SidebarItem icon={Compass} label="Outdoor Activity" onClick={() => navigate('/outdoor-activity')} active={false} />
            <SidebarItem icon={Sparkles} label="Work Planner" onClick={() => navigate('/work-planner')} active={false} />
            <SidebarItem icon={FileText} label="AI Reports" onClick={() => navigate('/ai-reports')} active={false} />
            <SidebarItem icon={Star} label="Reviews" onClick={() => navigate('/reviews')} active={false} />
            <SidebarItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} active={false} />
          </nav>`;

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Only process files that have a nav block
  if (!content.includes('<nav className="space-y-1">')) return;

  // Replace nav block
  content = content.replace(/<nav className="space-y-1">[\s\S]*?<\/nav>/, navBlock);
  
  // Fix active states and onClick for the current file
  if (file === 'Dashboard.jsx') {
    content = content.replace(/label="Dashboard"[^>]+active={false}/, 'label="Dashboard" active={true}');
  } else if (file === 'CurrentWeather.jsx') {
    content = content.replace(/label="Current Weather"[^>]+active={false}/, 'label="Current Weather" active={true} onClick={() => navigate(\'/current-weather\')}');
  } else if (file === 'TripPlanner.jsx') {
    content = content.replace(/label="Trip Planner"[^>]+active={false}/, 'label="Trip Planner" active={true} onClick={() => navigate(\'/trip-planner\')}');
  } else if (file === 'MyTrips.jsx') {
    content = content.replace(/label="My Trips"[^>]+active={false}/, 'label="My Trips" active={true} onClick={() => navigate(\'/my-trips\')}');
  } else if (file === 'OutdoorActivity.jsx') {
    content = content.replace(/label="Outdoor Activity"[^>]+active={false}/, 'label="Outdoor Activity" active={true} onClick={() => navigate(\'/outdoor-activity\')}');
  } else if (file === 'WorkPlanner.jsx') {
    content = content.replace(/label="Work Planner"[^>]+active={false}/, 'label="Work Planner" active={true} onClick={() => navigate(\'/work-planner\')}');
  } else if (file === 'AIReports.jsx') {
    content = content.replace(/label="AI Reports"[^>]+active={false}/, 'label="AI Reports" active={true} onClick={() => navigate(\'/ai-reports\')}');
  } else if (file === 'Settings.jsx') {
    content = content.replace(/label="Settings"[^>]+active={false}/, 'label="Settings" active={true} onClick={() => navigate(\'/settings\')}');
  }
  
  // Add Star to lucide-react if missing
  const importMatch = content.match(/import \{([^}]+)\} from 'lucide-react'/);
  if (importMatch) {
    let imports = importMatch[1];
    if (!imports.includes('Star')) {
      imports += ', Star';
      content = content.replace(importMatch[0], `import {${imports}} from 'lucide-react'`);
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
