/**
 * Email to Calendar AI Sync - Coursework & Class Updates Edition
 * Features: Multi-Step Setup Wizard, Multi-Email Filtering, Dedicated Settings Page,
 * Separated Dashboard Sections, and Intelligent Class Rescheduling/Duplicate Protection.
 */

// Entry points for Google Workspace Add-on contexts
function onHomepage(e) {
  const userProperties = PropertiesService.getUserProperties();
  const apiKey = userProperties.getProperty('GEMINI_API_KEY');

  if (!apiKey) {
    return buildStep1Card();
  }
  
  return buildDashboardCard();
}

function buildHomepageCard(e) {
  return onHomepage(e);
}

function onGmailMessage(e) {
  return onHomepage(e);
}

function onCalendarEvent(e) {
  return onHomepage(e);
}

// ============================================================================
// MULTI-STEP SETUP WIZARD (First-time Onboarding)
// ============================================================================

// STEP 1: Gemini API Key Setup Card
function buildStep1Card() {
  const userProperties = PropertiesService.getUserProperties();
  const savedApiKey = userProperties.getProperty('GEMINI_API_KEY') || "";

  const card = CardService.newCardBuilder();
  card.setHeader(
    CardService.newCardHeader()
      .setTitle('Setup: Step 1 of 3')
      .setSubtitle('Gemini API Configuration')
  );

  const guideSection = CardService.newCardSection()
    .setHeader('Get Your Free Gemini API Key');

  const instructionText = CardService.newTextParagraph()
    .setText('<b>1.</b> Visit <a href="https://aistudio.google.com/api-keys">Google AI Studio</a>.<br/>' +
             '<b>2.</b> Click <b>Create API key</b>.<br/>' +
             '<b>3.</b> Copy your key and paste it below.');

  guideSection.addWidget(instructionText);
  card.addSection(guideSection);

  const inputSection = CardService.newCardSection();
  const apiKeyInput = CardService.newTextInput()
    .setFieldName('api_key_input')
    .setTitle('Gemini API Key')
    .setHint('AIzaSy...')
    .setValue(String(savedApiKey));

  inputSection.addWidget(apiKeyInput);
  card.addSection(inputSection);

  const actionSection = CardService.newCardSection();
  const nextButton = CardService.newTextButton()
    .setText('Next: Email Filters ➡️')
    .setOnClickAction(CardService.newAction().setFunctionName('handleStep1Next'));

  actionSection.addWidget(nextButton);
  card.addSection(actionSection);

  return card.build();
}

function handleStep1Next(e) {
  const formInput = e.formInput || {};
  const apiKey = formInput.api_key_input ? String(formInput.api_key_input).trim() : '';
  
  if (!apiKey) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText('Error: Gemini API Key is required!'))
      .build();
  }

  PropertiesService.getUserProperties().setProperty('GEMINI_API_KEY', apiKey);

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(buildStep2Card()))
    .build();
}


// STEP 2: Multi-Email Sender Filter Setup Card
function buildStep2Card() {
  const userProperties = PropertiesService.getUserProperties();
  const savedEmailFilter = userProperties.getProperty('EMAIL_FILTER') || "";

  const card = CardService.newCardBuilder();
  card.setHeader(
    CardService.newCardHeader()
      .setTitle('Setup: Step 2 of 3')
      .setSubtitle('Email Sender Filters')
  );

  const guideSection = CardService.newCardSection()
    .setHeader('Configure Sender Filters');

  const instructionText = CardService.newTextParagraph()
    .setText('Specify sender email addresses or domains to monitor. Separate multiple addresses with commas (e.g., <i>notifications@instructure.com, prof@polyu.edu.hk</i>).<br/><br/>Non-Gmail emails, setup a <b>forwarding system<b/>.<br/><br/>Outlook: Settings > Mail > Rules > Add Rules<br/>Condition:  "From", Action: "Forward"<br/><br/><i>Tip: Leave blank to scan all unread inbox messages.</i>');

  guideSection.addWidget(instructionText);
  card.addSection(guideSection);

  const inputSection = CardService.newCardSection();
  const emailFilterInput = CardService.newTextInput()
    .setFieldName('email_filter_input')
    .setTitle('Sender Emails (Comma-separated)')
    .setHint('e.g. canvas@school.edu, alerts@school.edu')
    .setValue(String(savedEmailFilter));

  inputSection.addWidget(emailFilterInput);
  card.addSection(inputSection);

  const actionSection = CardService.newCardSection();
  const backButton = CardService.newTextButton()
    .setText('⬅️ Back')
    .setOnClickAction(CardService.newAction().setFunctionName('navigateBack'));

  const nextButton = CardService.newTextButton()
    .setText('Next: Target Calendar ➡️')
    .setOnClickAction(CardService.newAction().setFunctionName('handleStep2Next'));

  actionSection.addWidget(backButton);
  actionSection.addWidget(nextButton);
  card.addSection(actionSection);

  return card.build();
}

function handleStep2Next(e) {
  const formInput = e.formInput || {};
  const emailFilter = formInput.email_filter_input ? String(formInput.email_filter_input).trim() : '';
  
  PropertiesService.getUserProperties().setProperty('EMAIL_FILTER', emailFilter);

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(buildStep3Card()))
    .build();
}


// STEP 3: Sub-calendar Selection Card
function buildStep3Card() {
  const userProperties = PropertiesService.getUserProperties();
  const savedCalendarId = userProperties.getProperty('TARGET_CALENDAR_ID') || "";

  const card = CardService.newCardBuilder();
  card.setHeader(
    CardService.newCardHeader()
      .setTitle('Setup: Step 3 of 3')
      .setSubtitle('Target Calendar Selection')
  );

  const guideSection = CardService.newCardSection()
    .setHeader('Select Destination Calendar');

  const instructionText = CardService.newTextParagraph()
    .setText('Choose which Google Calendar you want your extracted assignments and class updates to be synced into.');

  guideSection.addWidget(instructionText);
  card.addSection(guideSection);

  const inputSection = CardService.newCardSection();
  const calendarDropdown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName('target_calendar_id')
    .setTitle('Target Export Calendar');

  const allCalendars = CalendarApp.getAllCalendars();
  const defaultCalId = CalendarApp.getDefaultCalendar().getId();

  allCalendars.forEach(cal => {
    const isSelected = savedCalendarId ? (cal.getId() === savedCalendarId) : (cal.getId() === defaultCalId);
    calendarDropdown.addItem(cal.getName(), cal.getId(), isSelected);
  });

  inputSection.addWidget(calendarDropdown);
  card.addSection(inputSection);

  const actionSection = CardService.newCardSection();
  const backButton = CardService.newTextButton()
    .setText('⬅️ Back')
    .setOnClickAction(CardService.newAction().setFunctionName('navigateBack'));

  const finishButton = CardService.newTextButton()
    .setText('🚀 Complete Setup')
    .setOnClickAction(CardService.newAction().setFunctionName('handleStep3Finish'));

  actionSection.addWidget(backButton);
  actionSection.addWidget(finishButton);
  card.addSection(actionSection);

  return card.build();
}

function handleStep3Finish(e) {
  const formInput = e.formInput || {};
  const userProperties = PropertiesService.getUserProperties();

  const selectedCal = formInput.target_calendar_id;
  const targetCalId = Array.isArray(selectedCal) ? selectedCal[0] : (selectedCal || '');
  userProperties.setProperty('TARGET_CALENDAR_ID', targetCalId);

  ensureAutoSyncTrigger();

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(buildDashboardCard()))
    .setNotification(CardService.newNotification().setText('Setup complete! Welcome to your dashboard.'))
    .build();
}


// ============================================================================
// DASHBOARD CARD (Home Page with Separated Sections)
// ============================================================================
function buildDashboardCard() {
  const card = CardService.newCardBuilder();
  
  card.setHeader(
    CardService.newCardHeader()
      .setTitle('Calendar Dashboard')
      .setSubtitle('Coursework & Class Updates Sync')
  );

  // Section 1: Recently Added Coursework
  const courseworkSection = CardService.newCardSection().setHeader('Recently Added Coursework (Last 5)');
  
  try {
    const recentCoursework = getLatestAddedEventsByTag('[COURSEWORK]', 5);
    if (recentCoursework.length === 0) {
      courseworkSection.addWidget(CardService.newTextParagraph().setText('<i>No recent coursework events found.</i>'));
    } else {
      recentCoursework.forEach(ev => {
        let title = ev.getTitle().replace('[COURSEWORK]', '').trim();
        const startTime = ev.getStartTime();
        const dateStr = Utilities.formatDate(startTime, Session.getScriptTimeZone(), "dd MMM yyyy, HH:mm");
        
        courseworkSection.addWidget(
          CardService.newTextParagraph().setText(`<b>${title}</b><br/>Due: ${dateStr}`)
        );
      });
    }
  } catch (err) {
    courseworkSection.addWidget(CardService.newTextParagraph().setText('Could not load coursework events.'));
  }

  card.addSection(courseworkSection);

  // Section 2: Recent Class Updates
  const classUpdatesSection = CardService.newCardSection().setHeader('Recent Class Updates (Last 5)');
  
  try {
    const recentUpdates = getLatestAddedEventsByTag('[CLASSUPDATES]', 5);
    if (recentUpdates.length === 0) {
      classUpdatesSection.addWidget(CardService.newTextParagraph().setText('<i>No recent class update events found.</i>'));
    } else {
      recentUpdates.forEach(ev => {
        let title = ev.getTitle().replace('[CLASSUPDATES]', '').trim();
        const startTime = ev.getStartTime();
        const dateStr = Utilities.formatDate(startTime, Session.getScriptTimeZone(), "dd MMM yyyy, HH:mm");
        
        classUpdatesSection.addWidget(
          CardService.newTextParagraph().setText(`<b>${title}</b><br/>Time: ${dateStr}`)
        );
      });
    }
  } catch (err) {
    classUpdatesSection.addWidget(CardService.newTextParagraph().setText('Could not load class updates.'));
  }

  card.addSection(classUpdatesSection);

  // Section 3: Actions
  const controlSection = CardService.newCardSection();

  const syncNowButton = CardService.newTextButton()
    .setText('🔄 Sync Unread Emails Now')
    .setOnClickAction(CardService.newAction().setFunctionName('handleManualSync'));

  const settingsButton = CardService.newTextButton()
    .setText('⚙️ Settings & Configuration')
    .setOnClickAction(CardService.newAction().setFunctionName('navigateToSettings'));

  controlSection.addWidget(syncNowButton);
  controlSection.addWidget(settingsButton);
  card.addSection(controlSection);
  
  return card.build();
}


// ============================================================================
// SETTINGS PAGE (Dedicated configuration card)
// ============================================================================
function buildSettingsCard() {
  const userProperties = PropertiesService.getUserProperties();
  const savedApiKey = userProperties.getProperty('GEMINI_API_KEY') || "";
  const savedEmailFilter = userProperties.getProperty('EMAIL_FILTER') || "";
  const savedCalendarId = userProperties.getProperty('TARGET_CALENDAR_ID') || "";

  const card = CardService.newCardBuilder();
  card.setHeader(
    CardService.newCardHeader()
      .setTitle('Add-on Settings')
      .setSubtitle('Manage your API key and preferences')
  );

  const section = CardService.newCardSection().setHeader('Configuration');

  const apiKeyInput = CardService.newTextInput()
    .setFieldName('api_key_input')
    .setTitle('Gemini API Key')
    .setValue(String(savedApiKey));

  section.addWidget(apiKeyInput);

  const emailFilterInput = CardService.newTextInput()
    .setFieldName('email_filter_input')
    .setTitle('Sender Email Filters (Comma-separated)')
    .setValue(String(savedEmailFilter));

  section.addWidget(emailFilterInput);

  const calendarDropdown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setFieldName('target_calendar_id')
    .setTitle('Target Export Calendar');

  const allCalendars = CalendarApp.getAllCalendars();
  allCalendars.forEach(cal => {
    const isSelected = savedCalendarId ? (cal.getId() === savedCalendarId) : false;
    calendarDropdown.addItem(cal.getName(), cal.getId(), isSelected);
  });

  section.addWidget(calendarDropdown);
  card.addSection(section);

  const actionSection = CardService.newCardSection();
  
  const saveButton = CardService.newTextButton()
    .setText('💾 Save Settings')
    .setOnClickAction(CardService.newAction().setFunctionName('handleSettingsSave'));

  const restartSetupButton = CardService.newTextButton()
    .setText('📖 Restart Setup Wizard')
    .setOnClickAction(CardService.newAction().setFunctionName('navigateToStep1'));

  const backButton = CardService.newTextButton()
    .setText('⬅️ Back to Dashboard')
    .setOnClickAction(CardService.newAction().setFunctionName('navigateToDashboard'));

  actionSection.addWidget(saveButton);
  actionSection.addWidget(restartSetupButton);
  actionSection.addWidget(backButton);
  card.addSection(actionSection);

  return card.build();
}

function handleSettingsSave(e) {
  const formInput = e.formInput || {};
  const userProperties = PropertiesService.getUserProperties();

  const apiKey = formInput.api_key_input ? String(formInput.api_key_input).trim() : '';
  if (!apiKey) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText('Error: Gemini API Key cannot be empty!'))
      .build();
  }

  userProperties.setProperty('GEMINI_API_KEY', apiKey);
  userProperties.setProperty('EMAIL_FILTER', formInput.email_filter_input ? String(formInput.email_filter_input).trim() : '');

  const selectedCal = formInput.target_calendar_id;
  const targetCalId = Array.isArray(selectedCal) ? selectedCal[0] : (selectedCal || '');
  userProperties.setProperty('TARGET_CALENDAR_ID', targetCalId);

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popCard())
    .setNotification(CardService.newNotification().setText('Settings saved successfully!'))
    .build();
}

function navigateToSettings() {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(buildSettingsCard()))
    .build();
}

function navigateToStep1() {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(buildStep1Card()))
    .build();
}

function navigateToDashboard() {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popCard())
    .build();
}

function navigateBack() {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popCard())
    .build();
}


// ============================================================================
// HELPER & SYNC FUNCTIONS
// ============================================================================
function getLatestAddedEventsByTag(tag, limit) {
  const userProperties = PropertiesService.getUserProperties();
  const targetCalendarId = userProperties.getProperty('TARGET_CALENDAR_ID') || '';

  let calendar = CalendarApp.getDefaultCalendar();
  if (targetCalendarId) {
    try {
      const customCalendar = CalendarApp.getCalendarById(targetCalendarId);
      if (customCalendar) calendar = customCalendar;
    } catch (err) {
      // Fallback to default
    }
  }

  const now = new Date();
  const past = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const future = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));

  const events = calendar.getEvents(past, future);
  const taggedEvents = events.filter(e => e.getTitle().includes(tag));
  taggedEvents.sort((a, b) => Math.abs(a.getStartTime() - now) - Math.abs(b.getStartTime() - now));

  return taggedEvents.slice(0, limit);
}

function handleManualSync() {
  processEmailsToCalendar();
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(buildDashboardCard()))
    .setNotification(CardService.newNotification().setText('Email sync finished! Dashboard updated.'))
    .build();
}

function ensureAutoSyncTrigger() {
  const existingTrigger = getUserProjectTrigger();
  if (!existingTrigger) {
    ScriptApp.newTrigger('processEmailsToCalendar')
      .timeBased()
      .everyHours(1)
      .create();
    Logger.log('[Setup] Automatically created 1-hour auto-sync trigger.');
  }
}

function getUserProjectTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'processEmailsToCalendar') {
      return triggers[i];
    }
  }
  return null;
}

function processEmailsToCalendar() {
  Logger.log('=== [START] processEmailsToCalendar execution triggered ===');
  
  const userProperties = PropertiesService.getUserProperties();
  const apiKey = userProperties.getProperty('GEMINI_API_KEY') || PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const emailFilterRaw = userProperties.getProperty('EMAIL_FILTER') || '';
  const targetCalendarId = userProperties.getProperty('TARGET_CALENDAR_ID') || '';

  if (!apiKey) {
    Logger.log('[ERROR] GEMINI_API_KEY property is missing. Aborting sync.');
    return;
  }

  let calendar = CalendarApp.getDefaultCalendar();
  if (targetCalendarId) {
    try {
      const customCalendar = CalendarApp.getCalendarById(targetCalendarId);
      if (customCalendar) {
        calendar = customCalendar;
        Logger.log(`[Calendar] Target calendar successfully loaded: "${calendar.getName()}"`);
      }
    } catch (err) {
      Logger.log(`[Warning] Could not access calendar ID "${targetCalendarId}", falling back to default.`);
    }
  }

  // Handle multi-email filtering (splitting by commas or semicolons)
  let searchQuery = 'is:unread label:inbox';
  if (emailFilterRaw) {
    const filters = emailFilterRaw.split(/[,;]+/).map(f => f.trim()).filter(f => f.length > 0);
    if (filters.length > 0) {
      const fromQueries = filters.map(f => `from:${f}`).join(' OR ');
      searchQuery = `is:unread label:inbox (${fromQueries})`;
    }
  }

  const threads = GmailApp.search(searchQuery);
  Logger.log(`[Gmail] Found ${threads.length} unread thread(s) matching query: "${searchQuery}"`);

  if (threads.length === 0) {
    Logger.log('=== [END] No unread emails found matching query. Exiting. ===');
    return;
  }

  const todayISO = new Date().toISOString();

  for (const thread of threads) {
    const messages = thread.getMessages();

    for (const message of messages) {
      if (!message.isUnread()) continue;

      const subject = message.getSubject();
      const body = message.getPlainBody();
      const fullEmailText = `Subject: ${subject}\nBody:\n${body}`;

      Logger.log(`[Processing] Analyzing Email Subject: "${subject}"`);

      const parsePrompt = `
You are an expert academic schedule and coursework extraction tool for university students.

TASK:
Analyze the email text provided below (including Canvas or university notifications) and determine if it contains:
1. COURSEWORK: An assignment, quiz, exam, project, or academic submission deadline.
2. CLASSUPDATES: A class time reschedule, room change, lecture reminder for a specific date/time, or class cancellation notice.
Ignore attendance-only check-ins or general announcements with no dates/deadlines.

FORMATTING & CATEGORIZATION RULES:
- category: Must be exactly either "COURSEWORK" or "CLASSUPDATES".
- Title format: "[COURSE CODE]: [Name/Topic]" (e.g., "AMA1702: Assignment 1" or "AMA1702: Lecture Reschedule"). Make sure to clean the title so it is clear and easy to understand.
- Description structure: Key requirements, instructions, new timings, or notes.
- Date/Time & Timezone:
  - Calculate all relative dates using Today's reference date/time.
  - For COURSEWORK, if only a deadline is provided with no start time, set \`startTime\` equal to \`endTime\`.
  - For CLASSUPDATES, set the actual start and end time of the rescheduled/reminder class session.
  - Output all timestamps in full ISO 8601 format (e.g., "2026-10-28T23:59:00+08:00").

Today's reference date/time is: ${todayISO}.

Return ONLY a valid JSON object matching this schema. If the email contains NO coursework or class updates, return {"hasEvent": false}:
{
  "hasEvent": true,
  "category": "COURSEWORK" | "CLASSUPDATES",
  "title": "string",
  "startTime": "ISO 8601 string",
  "endTime": "ISO 8601 string",
  "description": "string",
  "location": "string (optional)"
}

Email Text:
"${fullEmailText}"
      `;

      const parsePayload = {
        contents: [{ parts: [{ text: parsePrompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      };

      const eventData = callGeminiApiWithFallback(apiKey, parsePayload);
      let processedSuccessfully = false;

      if (eventData && eventData.hasEvent) {
        Logger.log(`[Gemini Success] Event detected! Category: "${eventData.category}", Title: "${eventData.title}"`);
        
        const startTime = new Date(eventData.startTime);
        const endTime = new Date(eventData.endTime);
        
        const categoryTag = (eventData.category === "CLASSUPDATES") ? "[CLASSUPDATES]" : "[COURSEWORK]";
        const finalTitle = categoryTag + " " + eventData.title;

        // Expanded 24-hour window for cross-midnight duplicate or update detection
        const windowStart = new Date(startTime.getTime() - (24 * 60 * 60 * 1000));
        const windowEnd = new Date(endTime.getTime() + (24 * 60 * 60 * 1000));
        const existingEvents = calendar.getEvents(windowStart, windowEnd);

        let handled = false;

        if (existingEvents.length > 0) {
          const existingListFormatted = existingEvents.map((e, index) => ({
            index: index,
            id: e.getId(),
            title: e.getTitle(),
            startTime: e.getStartTime().toISOString(),
            endTime: e.getEndTime().toISOString(),
            description: e.getDescription()
          }));

          const dupCheckPrompt = `Compare the "New Event Candidate" against existing calendar events to determine if it is a duplicate or a rescheduling update for the same class/event.

New Event Candidate: ${JSON.stringify({ ...eventData, title: finalTitle })}

Existing Calendar Events: ${JSON.stringify(existingListFormatted)}

Return ONLY a valid JSON object:
{
  "isDuplicate": boolean,
  "isRescheduleUpdate": boolean,
  "matchingEventIndex": number or null,
  "reason": "string"
}`;

          const dupPayload = {
            contents: [{ parts: [{ text: dupCheckPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          };

          const dupResult = callGeminiApiWithFallback(apiKey, dupPayload);
          
          if (dupResult) {
            // Case 1: Reschedule update -> Update existing calendar event instance in-place
            if (dupResult.isRescheduleUpdate && dupResult.matchingEventIndex !== null && existingEvents[dupResult.matchingEventIndex]) {
              const targetEvent = existingEvents[dupResult.matchingEventIndex];
              
              targetEvent.setTime(startTime, endTime);
              targetEvent.setTitle(finalTitle);
              if (eventData.description) targetEvent.setDescription(eventData.description);
              if (eventData.location) targetEvent.setLocation(eventData.location);

              Logger.log(`[Calendar Update] Rescheduled/Updated existing event: "${finalTitle}"`);
              handled = true;
            } 
            // Case 2: Standard duplicate -> Skip creation
            else if (dupResult.isDuplicate) {
              Logger.log(`[Duplicate Found] Skipped event: "${finalTitle}" - Reason: ${dupResult.reason}`);
              handled = true;
            }
          }
        }

        // Case 3: Brand new event or update couldn't be matched -> Create a new entry
        if (!handled) {
          const eventOptions = { description: eventData.description || "" };
          if (eventData.location) eventOptions.location = eventData.location;

          calendar.createEvent(finalTitle, startTime, endTime, eventOptions);
          Logger.log(`[Calendar Success] Created event: "${finalTitle}"`);
        }
        
        processedSuccessfully = true;
      } else {
        Logger.log('[Gemini] No valid coursework or class update detected in this email.');
        processedSuccessfully = true; 
      }

      if (processedSuccessfully) {
        message.markRead();
      }
    }
  }
  Logger.log('=== [END] processEmailsToCalendar execution completed ===');
}

// Robust helper function prioritizing Gemini 3.5 Flash Lite first
function callGeminiApiWithFallback(apiKey, payload) {
  const candidateModels = [
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-2.5-flash"
  ];

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    try {
      const response = UrlFetchApp.fetch(geminiUrl, options);
      const responseCode = response.getResponseCode();

      if (responseCode === 200) {
        const result = JSON.parse(response.getContentText());
        if (result.candidates && result.candidates.length > 0) {
          const textOutput = result.candidates[0].content.parts[0].text;
          return JSON.parse(textOutput);
        }
      }
    } catch (err) {
      Logger.log(`Error calling ${model}: ${err.toString()}`);
    }
  }

  Logger.log("Critical Error: All fallback models failed.");
  return null;
}
