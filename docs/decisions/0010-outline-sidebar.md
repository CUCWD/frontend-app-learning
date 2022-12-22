# Add Outline Sidebar

Following the [DISCOVERY](https://agile-jira.pearson.com/browse/PADV-213) made and the proposed [DESIGN](https://lucid.app/lucidchart/d52cc785-409f-4964-af29-ff277baa5bc5/edit?invitationId=inv_e569412e-e9f0-44aa-a9fa-54123d272f1a&referringApp=slack&page=l2M~LaFs47mo#), the MFE sidebar navigation is added in Frontend-App-Learning.

Using currently logic in Frontend-App-Learning, **Outline Sidebar** is integrated following Discussion Sidebar. Using the already created **SidebarBase** function, the integration of the Outline sidebar is done through an iframe, which allows the integration of a Microfrontend located in a certain path, in this case using the port :9090, called **SIDEBAR_MFE_BASE_URL**.

Then, using **SidebarTriggerBase**, the respective integration of the trigger is done, where to locate it in a different div from the one that already exists in src/courseware/course/Course.jsx module, the **SidebarOutlineTrigger** module is created.

To show the Outline Sidebar it is necessary to take the context through the **SidebarContext** function to src/courseware/course/sequence/Sequence.jsx where if the Outline Sidebar is active it will be shown on the left, otherwise another sidebar will be shown in the default from the platform.

## Next Step: Add Navigation Functionality

The next step for the Outline Sidebar integration is to make the navigation more user friendly where it goes to the subsection the user needs without the need to open another tab.
