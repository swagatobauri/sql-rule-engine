import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import "dotenv/config";
import {
  users,
  subscriptions,
  schemas,
  schemaTables,
  schemaColumns,
  problems,
  problemSolutions,
  problemRules,
  expectedResults,
  concepts,
  problemConcepts,
  interviewSessions,
  sessionQuestions,
  attempts,
  attemptRuns,
  attemptFeedback,
} from "./schema/tables.ts";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    await client.connect();
    const db = drizzle(client);

    console.log("🌱 Starting database seed...");

    // ===== USERS =====
    const userIds: string[] = [];
    const userEmails = [
      "admin@example.com",
      "mentor1@example.com",
      "mentor2@example.com",
      "user1@example.com",
      "user2@example.com",
      "user3@example.com",
      "user4@example.com",
      "user5@example.com",
      "user6@example.com",
      "user7@example.com",
    ];

    for (const email of userEmails) {
      const result = await db
        .insert(users)
        .values({
          email,
          passwordHash:
            "$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", // dummy hash
          role:
            email === "admin@example.com"
              ? "admin"
              : email.includes("mentor")
                ? "mentor"
                : "user",
        })
        .returning();
      if (result[0]) {
        userIds.push(result[0].id);
      }
    }
    console.log("✅ Seeded 10 users");

    // ===== SUBSCRIPTIONS =====
    for (let i = 0; i < userIds.length; i++) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + (Math.random() > 0.5 ? 1 : 3));

      await db.insert(subscriptions).values({
        userId: userIds[i]!,
        plan: i % 2 === 0 ? "free" : "paid",
        status:
          i % 3 === 0
            ? "cancelled"
            : i % 3 === 1
              ? "expired"
              : i % 3 === 2
                ? "trailing"
                : "active",
        expiresAt: i % 2 === 0 ? expiresAt : null,
        cancelledAt: i % 3 === 0 ? new Date() : null,
      });
    }
    console.log("✅ Seeded 10 subscriptions");

    // ===== SCHEMAS =====
    const schemaIds: string[] = [];
    const schemaNames = [
      "E-Commerce DB",
      "Social Network DB",
      "Hospital Management",
      "Library System",
      "Banking System",
      "Flight Booking",
      "Hotel Booking",
      "University DB",
      "HR Management",
      "Inventory System",
    ];

    for (const name of schemaNames) {
      const result = await db
        .insert(schemas)
        .values({
          name,
          description: `Schema for ${name}`,
        })
        .returning();
      if (result[0]) {
        schemaIds.push(result[0].id);
      }
    }
    console.log("✅ Seeded 10 schemas");

    // ===== SCHEMA TABLES =====
    const schemaTableIds: string[] = [];
    const tableConfigs = [
      { schemaIdx: 0, tables: ["users", "products", "orders"] },
      { schemaIdx: 1, tables: ["profiles", "posts", "comments"] },
      { schemaIdx: 2, tables: ["patients", "doctors", "appointments"] },
      { schemaIdx: 3, tables: ["books", "members", "rentals"] },
      { schemaIdx: 4, tables: ["accounts", "transactions", "loans"] },
      { schemaIdx: 5, tables: ["flights", "passengers", "bookings"] },
      { schemaIdx: 6, tables: ["hotels", "rooms", "reservations"] },
      { schemaIdx: 7, tables: ["students", "courses", "enrollments"] },
      { schemaIdx: 8, tables: ["employees", "departments", "salaries"] },
      { schemaIdx: 9, tables: ["products", "warehouses", "stock"] },
    ];

    for (const config of tableConfigs) {
      for (const tableName of config.tables) {
        const result = await db
          .insert(schemaTables)
          .values({
            schemaId: schemaIds[config.schemaIdx]!,
            tableName,
          })
          .returning();
        if (result[0]) {
          schemaTableIds.push(result[0].id);
        }
      }
    }
    console.log("✅ Seeded schema tables");

    // ===== SCHEMA COLUMNS =====
    const columnConfigs = [
      {
        tableIdx: 0,
        columns: [
          {
            columnName: "id",
            dataType: "uuid",
            isPk: true,
            isFk: false,
            isNullable: false,
          },
          {
            columnName: "email",
            dataType: "varchar",
            isPk: false,
            isFk: false,
            isNullable: false,
          },
          {
            columnName: "name",
            dataType: "varchar",
            isPk: false,
            isFk: false,
            isNullable: false,
          },
          {
            columnName: "created_at",
            dataType: "timestamp",
            isPk: false,
            isFk: false,
            isNullable: false,
          },
        ],
      },
      {
        tableIdx: 1,
        columns: [
          {
            columnName: "id",
            dataType: "uuid",
            isPk: true,
            isFk: false,
            isNullable: false,
          },
          {
            columnName: "name",
            dataType: "varchar",
            isPk: false,
            isFk: false,
            isNullable: false,
          },
          {
            columnName: "price",
            dataType: "decimal",
            isPk: false,
            isFk: false,
            isNullable: false,
          },
        ],
      },
    ];

    for (const config of columnConfigs) {
      for (const col of config.columns) {
        await db.insert(schemaColumns).values({
          schemaTableId: schemaTableIds[config.tableIdx]!,
          columnName: col.columnName,
          dataType: col.dataType,
          isPk: col.isPk,
          isFk: col.isFk,
          isNullable: col.isNullable,
        });
      }
    }
    console.log("✅ Seeded schema columns");

    // ===== CONCEPTS =====
    const conceptIds: string[] = [];
    const conceptNames = [
      "JOINs",
      "Aggregation",
      "Subqueries",
      "GROUP BY",
      "Window Functions",
      "Common Table Expressions",
      "UNION",
      "Case Statements",
      "String Functions",
      "Date Functions",
    ];

    for (const name of conceptNames) {
      const result = await db
        .insert(concepts)
        .values({
          name,
          description: `Understanding ${name} in SQL`,
        })
        .returning();
      if (result[0]) {
        conceptIds.push(result[0].id);
      }
    }
    console.log("✅ Seeded 10 concepts");

    // ===== PROBLEMS =====
    const problemIds: string[] = [];
    const problemTitles = [
      "Find all customers who made purchases",
      "Calculate total sales by month",
      "Find employees with highest salary",
      "Get books checked out in last 30 days",
      "Find accounts with negative balance",
      "Get all flights departing tomorrow",
      "Find available hotel rooms",
      "List students enrolled in multiple courses",
      "Find department with most employees",
      "Calculate inventory stock value",
    ];

    for (let i = 0; i < schemaIds.length; i++) {
      const result = await db
        .insert(problems)
        .values({
          schemaId: schemaIds[i]!,
          title: problemTitles[i],
          questionText: `Write a SQL query to: ${problemTitles[i]}`,
          difficulty:
            i % 3 === 0 ? "easy" : i % 3 === 1 ? "medium" : "hard",
          isFree: i % 2 === 0,
        } as any)
        .returning();
      if (result[0]) {
        problemIds.push(result[0].id);
      }
    }
    console.log("✅ Seeded 10 problems");

    // ===== PROBLEM SOLUTIONS =====
    const solutionIds: string[] = [];
    const solutionQueries = [
      "SELECT DISTINCT customer_id FROM orders;",
      "SELECT DATE_TRUNC('month', order_date) as month, SUM(amount) FROM orders GROUP BY month;",
      "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 1;",
      "SELECT * FROM rentals WHERE rental_date >= NOW() - INTERVAL '30 days';",
      "SELECT account_id, balance FROM accounts WHERE balance < 0;",
      "SELECT * FROM flights WHERE departure_date = CURRENT_DATE + 1;",
      "SELECT room_id, room_number FROM rooms WHERE is_available = true;",
      "SELECT student_id, COUNT(*) as courses FROM enrollments GROUP BY student_id HAVING COUNT(*) > 1;",
      "SELECT department_id, COUNT(*) as emp_count FROM employees GROUP BY department_id ORDER BY emp_count DESC LIMIT 1;",
      "SELECT SUM(quantity * unit_price) as total_value FROM stock;",
    ];

    for (let i = 0; i < problemIds.length; i++) {
      const result = await db
        .insert(problemSolutions)
        .values({
          problemId: problemIds[i]!,
          referenceSolutionQuery: solutionQueries[i],
        } as any)
        .returning();
      if (result[0]) {
        solutionIds.push(result[0].id);
      }
    }
    console.log("✅ Seeded 10 problem solutions");

    // ===== PROBLEM RULES =====
    for (let i = 0; i < problemIds.length; i++) {
      await db.insert(problemRules).values({
        problemId: problemIds[i]!,
        rules: {
          mustHaveJoin: i % 3 === 0,
          mustHaveGroupBy: i % 2 === 0,
          maxExecutionTime: 1000 + i * 100,
          allowedTables: ["users", "orders", "products"].slice(0, 2 + (i % 2)),
        },
        ruleVersion: 1,
      });
    }
    console.log("✅ Seeded problem rules");

    // ===== EXPECTED RESULTS =====
    for (let i = 0; i < problemIds.length; i++) {
      await db.insert(expectedResults).values({
        problemId: problemIds[i]!,
        solutionId: solutionIds[i]!,
        rows: [
          { id: "1", value: `result_${i}_1` },
          { id: "2", value: `result_${i}_2` },
          { id: "3", value: `result_${i}_3` },
        ],
        rowsHash: `hash_${i}_${Date.now()}`,
        ruleVersionSnapshot: 1,
        isActive: true,
      });
    }
    console.log("✅ Seeded expected results");

    // ===== PROBLEM CONCEPTS =====
    for (let i = 0; i < problemIds.length; i++) {
      const conceptIdx1 = i % conceptIds.length;
      const conceptIdx2 = (i + 1) % conceptIds.length;
      await db.insert(problemConcepts).values({
        problemId: problemIds[i]!,
        conceptId: conceptIds[conceptIdx1]!,
      });
      if (conceptIdx1 !== conceptIdx2) {
        await db.insert(problemConcepts).values({
          problemId: problemIds[i]!,
          conceptId: conceptIds[conceptIdx2]!,
        });
      }
    }
    console.log("✅ Seeded problem concepts");

    // ===== INTERVIEW SESSIONS =====
    const sessionIds: string[] = [];
    for (let i = 0; i < userIds.length; i++) {
      const endedAt =
        i % 2 === 0 ? new Date(Date.now() - 3600000) : null; // Some ended, some active
      const result = await db
        .insert(interviewSessions)
        .values({
          userId: userIds[i]!,
          mode: i % 2 === 0 ? "practice" : "interview",
          status:
            i % 3 === 0
              ? "completed"
              : i % 3 === 1
                ? "abandoned"
                : "active",
          endedAt,
          readinessCheckPassed: i % 2 === 0,
        })
        .returning();
      if (result[0]) {
        sessionIds.push(result[0].id);
      }
    }
    console.log("✅ Seeded 10 interview sessions");

    // ===== SESSION QUESTIONS =====
    const sessionQuestionIds: string[] = [];
    for (let i = 0; i < sessionIds.length; i++) {
      const result = await db
        .insert(sessionQuestions)
        .values({
          sessionId: sessionIds[i]!,
          problemId: problemIds[i % problemIds.length]!,
          orderIndex: i + 1,
          timerEnabled: i % 2 === 0,
          timeLimitSeconds: i % 2 === 0 ? 300 + i * 60 : null,
          status:
            i % 4 === 0
              ? "pending"
              : i % 4 === 1
                ? "answered"
                : i % 4 === 2
                  ? "skipped"
                  : "timed_out",
          usedAt: i % 2 === 0 ? new Date() : null,
        })
        .returning();
      if (result[0]) {
        sessionQuestionIds.push(result[0].id);
      }
    }
    console.log("✅ Seeded session questions");

    // ===== ATTEMPTS =====
    const attemptIds: string[] = [];
    for (let i = 0; i < sessionQuestionIds.length; i++) {
      const result = await db
        .insert(attempts)
        .values({
          sessionQuestionId: sessionQuestionIds[i]!,
          userId: userIds[i % userIds.length]!,
          finalQuery: i % 2 === 0 ? solutionQueries[i % solutionQueries.length] : null,
          status: i % 2 === 0 ? "passed" : "failed",
          score: i % 2 === 0 ? 80 + i * 2 : 40 + i * 3,
        })
        .returning();
      if (result[0]) {
        attemptIds.push(result[0].id);
      }
    }
    console.log("✅ Seeded 10 attempts");

    // ===== ATTEMPT RUNS =====
    for (let i = 0; i < sessionQuestionIds.length; i++) {
      await db.insert(attemptRuns).values({
        attemptId: i % 2 === 0 ? attemptIds[i] : null, // Some with null for drafts
        sessionQuestionId: sessionQuestionIds[i]!,
        queryText: solutionQueries[i % solutionQueries.length],
        queryHash: `hash_${i}_query`,
        output:
          i % 2 === 0
            ? [
                { id: 1, result: "success" },
                { id: 2, result: "success" },
              ]
            : null,
        errorText: i % 3 === 0 ? `Error at line ${i + 1}` : null,
        runtimeMs: i % 2 === 0 ? 150 + i * 10 : null,
        ruleVersionUsed: 1,
      } as any);
    }
    console.log("✅ Seeded attempt runs");

    // ===== ATTEMPT FEEDBACK =====
    for (let i = 0; i < attemptIds.length; i++) {
      await db.insert(attemptFeedback).values({
        attemptId: attemptIds[i]!,
        rubricScores: {
          correctness: 80 + (i % 3) * 5,
          efficiency: 75 + (i % 2) * 10,
          readability: 85 + (i % 4) * 3,
        },
        summary: `Good attempt with ${i % 2 === 0 ? "correct" : "minor"} issues.`,
      });
    }
    console.log("✅ Seeded attempt feedback");

    console.log("\n✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
