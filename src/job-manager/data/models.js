/**
 * Domain model reference for the mock repository and future Supabase tables.
 * IDs are strings; money is stored as numeric GBP values; dates are ISO strings.
 *
 * @typedef {{id:string,name:string,email:string,role:'administrator'|'site_manager'}} User
 * @typedef {{id:string,name:string,phone:string,email:string,preferredContact:string,bestContactTime:string,emergencyContact:string}} Client
 * @typedef {{id:string,clientId:string,title:string,projectType:string,description:string,status:string,address:string,postcode:string,startDate:string,endDate:string,estimatedDuration:string,assignedTo:string,contractValue:number,amountPaid:number,outstandingBalance:number,accessNotes:string,parkingNotes:string,keyStatus:string,internalNotes:string,nextAction:string,scope:string[],provisional:boolean,createdAt:string,updatedAt:string}} Project
 * @typedef {{id:string,projectId:string,type:string,title:string,startDate:string,endDate:string,allDay:boolean,location:string,notes:string,colourCategory:string,googleCalendarId:string|null,googleCalendarEventId:string|null,syncStatus:'not_configured'|'synced'|'failed',lastSyncedAt:string|null}} ProjectEvent
 * @typedef {{id:string,projectId:string,title:string,dueDate:string,assignedTo:string,priority:'Low'|'Medium'|'High',completed:boolean,status:'Pending'|'Completed'}} Task
 * @typedef {{id:string,projectId:string,title:string,percentage:number,amount:number,dueDate:string,paidDate:string,status:'Due'|'Paid',invoiceReference:string,notes:string}} Payment
 * @typedef {{id:string,projectId:string|null,leadId:string|null,type:string,name:string,url:string,storagePath:string|null,createdAt:string,uploadedBy:string}} Document
 * @typedef {{id:string,projectId:string,userId:string,category:string,message:string,createdAt:string,updatedAt:string}} JournalEntry
 * @typedef {{id:string,projectId:string,stage:'Before'|'Progress'|'Completed',title:string,url:string,createdAt:string,uploadedBy:string}} ProjectPhoto
 * @typedef {{id:string,projectId:string,userId:string|null,action:string,actorType:string|null,actorName:string|null,source:string|null,entityType:string|null,entityId:string|null,previousValues:object|null,newValues:object|null,createdAt:string}} ActivityLog
 */

export const PROJECT_STATUSES = ['Enquiry', 'Quoted', 'Confirmed', 'Scheduled', 'In Progress', 'On Hold', 'Completed', 'Cancelled']
