package servlets;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import util.SessionStorage;
import util.Validate;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@WebServlet("/controller")
public class ControllerServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        final String INVALID_DATA_MSG = "Пожалуйста, установите корректные значения параметров.";

        if ("clear".equals(request.getParameter("operation"))) {
            SessionStorage storage = (SessionStorage) request.getSession().getAttribute("sessionStorage");
            if (storage != null) storage.clearResult();
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        String xParam = request.getParameter("x");
        String yParam = request.getParameter("y");
        String rParam = request.getParameter("r");

        try {
            if (xParam == null || yParam == null || rParam == null ||
                    xParam.isEmpty() || yParam.isEmpty() || rParam.isEmpty()) {
                request.getRequestDispatcher("/index.jsp").forward(request, response);
                return;
            }

            double x = Double.parseDouble(xParam);
            double y = Double.parseDouble(yParam);
            double r = Double.parseDouble(rParam);

            if (!Validate.validateX(x) || !Validate.validateY(y) || !Validate.validateR(r)) {
                sendError(response, INVALID_DATA_MSG);
                return;
            }

            request.getRequestDispatcher("/checkArea").forward(request, response);
        } catch (NumberFormatException e) {
            sendError(response, "Неверный формат чисел: " + e.getMessage());
        } catch (Exception e) {
            sendError(response, "Ошибка сервера: " + e.getMessage());
        }
    }

    private void sendError(HttpServletResponse response, String errorMessage) throws IOException {
        Gson json = new Gson();
        Map<String, String> jsonResp = new LinkedHashMap<>();
        jsonResp.put("error", errorMessage);
        jsonResp.put("status", "Недопустимые значения параметров");
        response.setContentType("application/json");
        response.getWriter().write(json.toJson(jsonResp));
        response.setStatus(422);
    }
}